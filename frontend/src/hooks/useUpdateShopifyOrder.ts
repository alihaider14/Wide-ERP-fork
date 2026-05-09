import { handleApiError } from "@/helper/error-function";
import { calculateProductDiscount } from "@/helper/number-formator";
import {
	deriveShopifyTaxPercentage,
	stripShopifyOrderFields,
} from "@/helper/shopify-utils";
import { hasChangedData } from "@/lib/utils";
import {
	getShopifyOrdersByOrderIds,
	updateShopifyOrder,
} from "@/services/shopifyorders";
import {
	TUpdateShopifyOrder,
	TShopifyProduct,
	TUpdateShopifyOrderPayload,
} from "@/types/shopify";
import { TError } from "@/types/TError";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const useUpdateShopifyOrder = () => {
	const navigate = useNavigate();
	const { id } = useParams();
	const { state } = useLocation();

	if (!id || !state) navigate("/shopify");

	const { shopId, orderName } = state;
	const [shopifyData, setShopifyData] = useState<Partial<TUpdateShopifyOrder>>(
		{},
	);

	const {
		data: responseData,
		isLoading: isShopifyOrderByIdLoading,
		error,
	} = useQuery({
		queryKey: [`shopifyorderById/${id}`, id],
		queryFn: () => getShopifyOrdersByOrderIds(shopId, [String(id)]),
		enabled: !!id && !!shopId,
	});

	const data = responseData?.[0];

	useEffect(() => {
		if (error) {
			toast.error(`Couldnt find the order ${orderName} to update.`);
			navigate("/shopify");
			return;
		}

		if (!data) return;

		setShopifyData({
			...data,
			product: data.product.map((item) => ({
				...item,
				actualPrice: Number(item.price || 0),
			})),
		});
	}, [data, error]);

	const handleProductChange = (index: number, value: string, name: string) => {
		setShopifyData((prev) => {
			if (!prev.product) return prev;

			const updatedProducts = prev.product.map((item, i) =>
				i === index
					? { ...item, [name]: name === "qty" ? Number(value) : value }
					: item,
			);

			const totalAmount = updatedProducts
				.reduce(
					(sum, item) => sum + Number(item.price || "0") * (item.qty || 0),
					0,
				)
				.toFixed(2);

			return {
				...prev,
				product: updatedProducts,
				totalAmount,
			};
		});
	};

	const handleDeleteProduct = (index: number) => {
		setShopifyData((prev) => {
			return prev.product && prev.product.length > 0
				? {
						...prev,
						product: prev.product.filter((_, i) => i !== index),
					}
				: prev;
		});
	};

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setShopifyData((prev) => ({
			...prev,
			[event.target.name]: event.target.value,
		}));
	};

	const handleCheckStatus = (checked: boolean) => {
		setShopifyData((prev) => ({
			...prev,
			status: checked ? "Paid" : "Pending",
		}));
	};

	const handleAddProduct = (product: TShopifyProduct) => {
		const actualQty = Number(product.actualQty ?? product.qty ?? 0);

		if (actualQty <= 0) {
			toast.error(`${product?.sku} is out of stock`);
			return;
		}

		setShopifyData((prev) => {
			const existingProducts = prev.product || [];

			const index = existingProducts.findIndex((p) => p.sku === product.sku);

			let updatedProducts = [...existingProducts];

			if (index !== -1) {
				const existing = updatedProducts[index];

				const currentQty = Number(existing.qty || 0);
				const newQty = Math.min(currentQty + 1, actualQty);

				updatedProducts[index] = {
					...existing,
					qty: newQty,
					actualQty,
				};
			} else {
				updatedProducts.push({
					...product,
					qty: 1,
					actualQty,
				});
			}

			return {
				...prev,
				product: updatedProducts,
			};
		});
	};

	const { productTotalAmount, totalAmount } = useMemo(() => {
		if (!shopifyData?.product || !data) {
			return {
				productTotalAmount: 0,
				totalAmount: 0,
			};
		}

		const taxPercentage = deriveShopifyTaxPercentage(data);

		const productTotalAmount =
			shopifyData.product.reduce(
				(sum, item) => sum + Number(item.price || 0) * Number(item.qty || 0),
				0,
			) || 0;

		const updatedDiscount = calculateProductDiscount(
			productTotalAmount,
			shopifyData.discount || "0",
		);

		const discountedSubtotal = Math.max(
			0,
			productTotalAmount - updatedDiscount,
		);
		const tax = discountedSubtotal * taxPercentage;
		const shipping = Number(shopifyData.deliveryCharges || 0);
		const totalAmount = discountedSubtotal + tax + shipping;

		return {
			productTotalAmount: +productTotalAmount.toFixed(2),
			totalAmount: +totalAmount.toFixed(2),
		};
	}, [
		shopifyData?.product,
		shopifyData.deliveryCharges,
		shopifyData.discount,
		shopifyData.totalAmount,
		data,
	]);

	const changeFlags = useMemo(() => {
		if (!data) {
			return {
				metadataChanged: false,
				editSessionChanged: false,
				statusChanged: false,
				shippingRemarksChanged: false,
			};
		}

		const metadataChanged = hasChangedData(
			{
				customerName: data.customerName,
				phoneNo: data.phoneNo,
				address: data.address,
				city: data.city,
				country: data.country,
				note: data.note,
				apartmentSuit: data.apartmentSuit,
				postalCode: data.postalCode,
			},
			{
				customerName: shopifyData.customerName,
				phoneNo: shopifyData.phoneNo,
				address: shopifyData.address,
				city: shopifyData.city,
				country: shopifyData.country,
				note: shopifyData.note,
				apartmentSuit: shopifyData.apartmentSuit,
				postalCode: shopifyData.postalCode,
			},
		);

		// Edit session: product (stripped), deliveryCharges, discount
		const editSessionChanged =
			hasChangedData(
				stripShopifyOrderFields(data.product),
				stripShopifyOrderFields(shopifyData.product ?? []),
			) ||
			hasChangedData(data.deliveryCharges, shopifyData.deliveryCharges) ||
			hasChangedData(data.discount, shopifyData.discount);

		const statusChanged = hasChangedData(data.status, shopifyData.status);

		const shippingRemarksChanged = hasChangedData(
			data.shippingRemarks,
			shopifyData.shippingRemarks,
		);

		return {
			metadataChanged,
			editSessionChanged,
			statusChanged,
			shippingRemarksChanged,
		};
	}, [data, shopifyData]);

	const hasAnyChange = Object.values(changeFlags).some(Boolean);

	const updateShopifyOrderMutation = useMutation({
		mutationFn: updateShopifyOrder,
		onSuccess: handleUpdateShopifyOrderSuccess,
		onError: handleUpdateShopifyOrderError,
	});

	const handleUpdateShopifyOrder = () => {
		if (!hasAnyChange) return;

		const payload: TUpdateShopifyOrderPayload = {
			orderId: String(id),
			shopId,
		};

		if (changeFlags.metadataChanged) {
			payload.metadata = {
				customerName: shopifyData.customerName!,
				phoneNo: shopifyData.phoneNo!,
				address: shopifyData.address!,
				city: shopifyData.city!,
				country: shopifyData.country!,
				note: shopifyData.note,
				apartmentSuit: shopifyData.apartmentSuit,
				postalCode: shopifyData.postalCode,
			};
		}

		if (changeFlags.editSessionChanged) {
			payload.editSession = {
				product: stripShopifyOrderFields(
					shopifyData.product ?? [],
				) as TShopifyProduct[],
				deliveryCharges: String(shopifyData.deliveryCharges ?? "0"),
				discount: shopifyData.discount ?? "0",
			};
		}

		if (changeFlags.statusChanged && shopifyData.status)
			payload.status = shopifyData.status;

		if (changeFlags.shippingRemarksChanged && shopifyData.shippingRemarks)
			payload.shippingRemarks = shopifyData.shippingRemarks;

		updateShopifyOrderMutation.mutate({ data: payload });
	};

	function handleUpdateShopifyOrderSuccess() {
		toast.success("Shopify Order updated successfully.");
		setShopifyData({});
		navigate("/shopify");
	}

	function handleUpdateShopifyOrderError(error: TError) {
		handleApiError(error, "Failed to update order. Please try again.");
	}

	const isLoading =
		isShopifyOrderByIdLoading || updateShopifyOrderMutation.isPending;

	return {
		orderName,
		navigate,
		isLoading,
		shopifyData,
		handleDeleteProduct,
		handleProductChange,
		handleChange,
		handleCheckStatus,
		setShopifyData,
		handleAddProduct,
		productTotalAmount,
		totalAmount,
		handleUpdateShopifyOrder,
		shopId,
		disabledSubmitButton: !hasAnyChange,
	};
};
export default useUpdateShopifyOrder;
