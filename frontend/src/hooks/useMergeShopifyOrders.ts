import { handleApiError } from "@/helper/error-function";
import { calculateProductDiscount } from "@/helper/number-formator";
import {
	deriveShopifyTaxPercentage,
	mergeShopifyProducts,
	mergeTextFields,
	stripShopifyOrderFields,
} from "@/helper/shopify-utils";
import {
	getShopifyOrdersByOrderIds,
	mergeShopifyOrders,
} from "@/services/shopifyorders";
import {
	TShopifyProduct,
	TShopifyMergedData,
	TShopifyCustomerData,
	TMergeShopifyOrdersPayload,
} from "@/types/shopify";
import { TError } from "@/types/TError";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";

const useMergeShopifyOrders = () => {
	const navigate = useNavigate();
	const { state } = useLocation();

	if (!state) navigate("/shopify");

	const {
		shopId,
		orderIds,
		orderName,
	}: { shopId: string; orderIds: string[]; orderName: string[] } = state;

	const [mergedData, setMergedData] = useState<Partial<TShopifyMergedData>>({});
	const [customerData, setCustomerData] = useState<
		Record<string, TShopifyCustomerData>
	>({});
	const [selectedCustomer, setSelectedCustomer] = useState<string>("");

	const {
		data: orders,
		isLoading: isOrdersLoading,
		error,
	} = useQuery({
		queryKey: [`shopifyorderById/${orderIds}`, orderIds],
		queryFn: () => getShopifyOrdersByOrderIds(shopId, orderIds),
		enabled: !!orderIds && !!shopId,
	});

	useEffect(() => {
		if (error) {
			toast.error(`Couldnt find ${orderName.join(", ")} orders to merge.`);
			navigate("/shopify");
			return;
		}

		if (!orders || orders.length < 2) return;

		const [order1, order2] = orders;

		setMergedData({
			product: mergeShopifyProducts(order1.product, order2.product),
			discount: String(
				Number(order1.discount ?? 0) + Number(order2.discount ?? 0),
			),
			deliveryCharges: String(
				Math.max(
					Number(order1.deliveryCharges ?? 0),
					Number(order2.deliveryCharges ?? 0),
				),
			),
			note: mergeTextFields(order1.note, order2.note),
			shippingRemarks: mergeTextFields(
				order1.shippingRemarks,
				order2.shippingRemarks,
			),
			status:
				order1.status === "Paid" || order2.status === "Paid"
					? "Paid"
					: "Pending",
		});

		setCustomerData({
			[order1.orderId]: {
				customerName: order1.customerName,
				phoneNo: order1.phoneNo,
				address: order1.address,
				city: order1.city,
				country: order1.country,
				note: order1.note,
				apartmentSuit: order1.apartmentSuit,
				postalCode: order1.postalCode,
			},
			[order2.orderId]: {
				customerName: order2.customerName,
				phoneNo: order2.phoneNo,
				address: order2.address,
				city: order2.city,
				country: order2.country,
				note: order2.note,
				apartmentSuit: order2.apartmentSuit,
				postalCode: order2.postalCode,
			},
		});

		// Default: select first order
		setSelectedCustomer(order1.orderId);
	}, [orders]);

	const handleProductChange = (index: number, value: string, name: string) => {
		setMergedData((prev) => {
			if (!prev.product) return prev;

			const updatedProducts = prev.product.map((item, i) =>
				i === index
					? { ...item, [name]: name === "qty" ? Number(value) : value }
					: item,
			);

			return { ...prev, product: updatedProducts };
		});
	};

	const handleDeleteProduct = (index: number) => {
		setMergedData((prev) =>
			prev.product && prev.product.length > 0
				? { ...prev, product: prev.product.filter((_, i) => i !== index) }
				: prev,
		);
	};

	const handleAddProduct = (product: TShopifyProduct) => {
		const actualQty = Number(product.actualQty ?? product.qty ?? 0);

		if (actualQty <= 0) {
			toast.error(`${product?.sku} is out of stock`);
			return;
		}

		setMergedData((prev) => {
			const existingProducts = prev.product || [];
			const index = existingProducts.findIndex((p) => p.sku === product.sku);
			const updatedProducts = [...existingProducts];

			if (index !== -1) {
				const existing = updatedProducts[index];
				updatedProducts[index] = {
					...existing,
					qty: Math.min(Number(existing.qty || 0) + 1, actualQty),
					actualQty,
				};
			} else {
				updatedProducts.push({ ...product, qty: 1, actualQty });
			}

			return { ...prev, product: updatedProducts };
		});
	};

	const handleMergedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setMergedData((prev) => ({
			...prev,
			[event.target.name]: event.target.value,
		}));
	};

	const handleStatusChange = (checked: boolean) => {
		setMergedData((prev) => ({
			...prev,
			status: checked ? "Paid" : "Pending",
		}));
	};

	const handleCustomerChange = (
		orderId: string,
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		setCustomerData((prev) => ({
			...prev,
			[orderId]: {
				...prev[orderId],
				[event.target.name]: event.target.value,
			},
		}));
	};

	const handleCustomerFieldSelect = (
		orderId: string,
		field: keyof TShopifyCustomerData,
		value: string,
	) => {
		setCustomerData((prev) => ({
			...prev,
			[orderId]: {
				...prev[orderId],
				[field]: value,
				...(field === "country" &&
					value !== prev[orderId]?.country && { city: "" }),
			},
		}));
	};

	const { productTotalAmount, totalAmount } = useMemo(() => {
		if (!mergedData.product || !orders || orders.length < 2)
			return { productTotalAmount: 0, totalAmount: 0 };

		const selectedOrder = orders.find((o) => o.orderId === selectedCustomer);
		if (!selectedOrder) return { productTotalAmount: 0, totalAmount: 0 };

		const taxPercentage = deriveShopifyTaxPercentage(selectedOrder);

		const productTotalAmount =
			mergedData.product.reduce(
				(sum, item) => sum + Number(item.price || 0) * Number(item.qty || 0),
				0,
			) || 0;

		const updatedDiscount = calculateProductDiscount(
			productTotalAmount,
			mergedData.discount || "0",
		);

		const discountedSubtotal = Math.max(
			0,
			productTotalAmount - updatedDiscount,
		);
		const tax = discountedSubtotal * taxPercentage;
		const shipping = Number(mergedData.deliveryCharges || 0);
		const totalAmount = discountedSubtotal + tax + shipping;

		return {
			productTotalAmount: +productTotalAmount.toFixed(2),
			totalAmount: +totalAmount.toFixed(2),
		};
	}, [
		mergedData.product,
		mergedData.discount,
		mergedData.deliveryCharges,
		selectedCustomer,
		orders,
	]);

	const mergeOrdersMutation = useMutation({
		mutationFn: mergeShopifyOrders,
		onSuccess: () => {
			toast.success("Orders merged successfully.");
			navigate("/shopify");
		},
		onError: (error: TError) => {
			handleApiError(error, "Failed to merge orders. Please try again.");
		},
	});

	const handleMergeOrders = () => {
		if (!orders || orders.length < 2 || !selectedCustomer) return;

		const deletedOrder = orders.find((o) => o.orderId !== selectedCustomer);
		if (!deletedOrder) return;

		const payload: TMergeShopifyOrdersPayload = {
			shopId,
			mergedOrderId: selectedCustomer,
			deletedOrderId: deletedOrder.orderId,
			metadata: { ...customerData[selectedCustomer], note: mergedData?.note },
			editSession: {
				product: stripShopifyOrderFields(
					mergedData.product ?? [],
				) as TShopifyProduct[],
				deliveryCharges: String(mergedData.deliveryCharges ?? "0"),
				discount: mergedData.discount ?? "0",
			},
			status: mergedData.status ?? "Pending",
			shippingRemarks: mergedData.shippingRemarks ?? "",
		};

		mergeOrdersMutation.mutate({ data: payload });
	};

	const isLoading = isOrdersLoading || mergeOrdersMutation.isPending;
	const disabledSubmitButton =
		!selectedCustomer || !orders || orders.length < 2;

	return {
		orderName,
		navigate,
		isLoading,
		orders,
		mergedData,
		customerData,
		selectedCustomer,
		setSelectedCustomer,
		handleProductChange,
		handleDeleteProduct,
		handleAddProduct,
		handleMergedChange,
		handleStatusChange,
		handleCustomerChange,
		handleCustomerFieldSelect,
		productTotalAmount,
		totalAmount,
		handleMergeOrders,
		shopId,
		disabledSubmitButton,
	};
};

export default useMergeShopifyOrders;
