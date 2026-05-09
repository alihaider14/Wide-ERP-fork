import { handlePrint } from "@/components/custom/PrintReceipt";
import { handleApiError } from "@/helper/error-function";
import { OrderService } from "@/services";
import { TAddAndUpdateOrderResponse, TOrder, TOrderItems } from "@/types/Order";
import { TError } from "@/types/TError";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import useBarcodeReader from "./useBarcodeReader";
import { calculateDiscount } from "@/helper/number-formator";
import useAccessStore from "./useAccessStore";

const useUpdateOrder = () => {
	const navigate = useNavigate();
	const { id } = useParams();
	const [prompt, setPrompt] = useState(false);
	const [cart, setCart] = useState<{ [key: string]: TOrderItems }>({});
	const [orderData, setOrderData] = useState<Partial<TOrder>>({});
	const [loading, setLoading] = useState(false);
	const { userId } = useAccessStore((state) => state);

	const { data, isLoading: isOrderByIdLoading } = useQuery({
		queryKey: [`orderById/${id}`, id],
		queryFn: () => OrderService.orderById(id),
		enabled: !!id,
	});

	useEffect(() => {
		if (data) {
			const discountedAmountBeforeGlobal = data?.order?.items!.reduce(
				(sum, item) => sum + item.price * item.quantity!,
				0,
			);

			const globalDiscountedAmount = calculateDiscount(
				discountedAmountBeforeGlobal,
				data?.order?.discount,
			);

			const perItemDiscount =
				data?.order?.sub_total_amount - discountedAmountBeforeGlobal;
			const globalDiscount =
				discountedAmountBeforeGlobal - globalDiscountedAmount;

			setOrderData({
				...data?.order,
				discount: String(globalDiscount - perItemDiscount),
			});
			setCart(
				data?.order?.items!.reduce((acc, item) => {
					acc[item.product_id] = {
						sku: item?.sku,
						product_id: item.product_id,
						price: item.price,
						quantity: item.quantity!,
						product_qty: item?.product_qty,
						total_price: Number(item?.price * item?.quantity),
						original_price: Number(item?.original_price),
					};
					return acc;
				}, {} as { [key: string]: TOrderItems }),
			);
		}
	}, [data]);

	const handleChange =
		(setter: React.Dispatch<React.SetStateAction<Partial<TOrder>>>) =>
		(event: React.ChangeEvent<HTMLInputElement>) => {
			setter((prev) => ({
				...prev,
				[event.target.name]: event.target.value,
			}));
		};

	const onAddToCart = (item: TOrderItems) => {
		if (item.product_qty! <= 0) {
			toast.error(`${item.sku} is out of stock`);
		} else {
			setCart((prevCart) => {
				const newCart = { ...prevCart };
				if (newCart[item.product_id]) {
					const qty = newCart[item.product_id]?.quantity || 0;

					newCart[item.product_id] = {
						...item,
						quantity: qty + 1,
						total_price: (qty + 1) * newCart[item.product_id]?.price,
						price: newCart[item.product_id]?.price,
					};
				} else {
					newCart[item.product_id] = {
						...item,
						quantity: 1,
						total_price: item.price,
					};
				}
				return newCart;
			});
		}
	};

	const onUpdateCartQty = (
		type: "increase" | "decrease",
		item: TOrderItems,
	) => {
		setCart((prevCart) => {
			const newCart = { ...prevCart };

			if (newCart[item.product_id!]) {
				const newQuantity =
					type === "increase"
						? (newCart[item.product_id!]?.quantity || 0) + 1
						: (newCart[item.product_id!]?.quantity || 0) - 1;

				if (newQuantity > 0) {
					newCart[item.product_id!] = {
						...newCart[item.product_id!],
						quantity: newQuantity,
						total_price: newQuantity * newCart[item.product_id!].price,
					};
				} else {
					delete newCart[item.product_id!];
				}
			}

			return newCart;
		});
	};

	const onDeleteToCart = (item: TOrderItems) => {
		setCart((prevCart) => {
			const newCart = { ...prevCart };
			delete newCart[item.product_id!];
			return newCart;
		});
	};

	const onUpdateCartItem = (
		item: TOrderItems,
		updatedFields: Partial<TOrderItems>,
	) => {
		setCart((prevCart) => {
			const newCart = { ...prevCart };
			newCart[item.product_id!] = {
				...newCart[item.product_id!],
				...updatedFields,
			};
			return newCart;
		});
	};

	const { total, amount, totalQuantity } = useMemo(() => {
		const cartItems = Object.values(cart);

		const originalAmount = cartItems.reduce(
			(sum, item) => sum + (item.original_price! || 0) * item.quantity!,
			0,
		);

		const discountedAmountBeforeGlobal = cartItems.reduce(
			(sum, item) => sum + item.price * item.quantity!,
			0,
		);

		const globalDiscountedAmount = calculateDiscount(
			discountedAmountBeforeGlobal,
			orderData?.discount,
		);

		const totalQuantity = cartItems.reduce(
			(sum, item) => sum + (item.quantity || 0),
			0,
		);

		return {
			total: Number(globalDiscountedAmount),
			amount: originalAmount || 0,
			totalQuantity,
		};
	}, [cart, orderData?.discount]);

	useEffect(() => {
		setOrderData((prev) => ({
			...prev,
			sub_total_amount: amount,
			total_amount: total,
			items_count: totalQuantity,
			items: Object.values(cart).map((item) => ({
				product_id: item.product_id,
				price: item.price,
				quantity: item.quantity!,
				original_price: item?.original_price,
			})),
		}));
	}, [cart, amount, total, totalQuantity]);

	// Update Order Mutation
	const updateOrderMutation = useMutation({
		mutationFn: OrderService.updateOrder,
		onSuccess: handleUpdateOrderSuccess,
		onError: handleUpdateOrderError,
	});

	const handleUpdateOrder = (
		status?: "completed" | "cancelled" | "drafted",
	) => {
		if (
			status === "completed" &&
			orderData?.recieved_amount &&
			orderData.recieved_amount! < orderData.total_amount!
		) {
			toast.error("Recieved amount must be greater or equal to total amount.");
		} else if (
			status &&
			orderData?.customer_name &&
			orderData?.sub_total_amount &&
			orderData?.total_amount &&
			orderData?.items!.length > 0 &&
			orderData?.items_count
		) {
			setLoading(true);
			updateOrderMutation.mutate({ ...orderData, status, user_id: userId! });
		} else {
			toast.error("Please fill the required field");
		}
	};

	function handleUpdateOrderSuccess(data: TAddAndUpdateOrderResponse) {
		toast.success("Order updated successfully.");
		setLoading(false);
		setOrderData({});
		setCart({});

		if (data?.order?.status === "completed") {
			const orderDetails = {
				...orderData,
				order_number: data?.order?.order_number,
				invoice_date: data?.order?.createdAt,
			};

			handlePrint(orderDetails, cart);
			navigate("/order-completed", {
				state: {
					order: {
						orderId: data.order?._id,
						...orderData,
					},
					cart,
				},
			});
		} else navigate("/orders");
	}

	const isDataUnchanged =
		orderData.customer_name === data?.order?.customer_name &&
		orderData.discount === data?.order?.discount &&
		orderData.customer_phone === data?.order?.customer_phone &&
		orderData.sub_total_amount === data?.order?.sub_total_amount &&
		orderData.total_amount === data?.order?.total_amount &&
		orderData.items_count === data?.order?.items_count &&
		JSON.stringify(orderData.recieved_amount || "") ===
			JSON.stringify(data?.order?.recieved_amount || "") &&
		JSON.stringify(orderData.items) ===
			JSON.stringify(
				data?.order?.items?.map((item) => ({
					product_id: item.product_id,
					price: item.price,
					quantity: item.quantity,
				})),
			);

	function handleUpdateOrderError(error: TError) {
		setLoading(false);
		handleApiError(error, "Failed to update order. Please try again.");
	}

	useBarcodeReader({ onAddToCart });

	const isLoading =
		loading || updateOrderMutation?.isPending || isOrderByIdLoading;

	return {
		prompt,
		cart,
		orderData,
		isLoading,
		setPrompt,
		onAddToCart,
		onUpdateCartQty,
		setOrderData,
		handleChange,
		handleUpdateOrder,
		navigate,
		onDeleteToCart,
		isDataUnchanged,
		onUpdateCartItem,
	};
};

export default useUpdateOrder;
