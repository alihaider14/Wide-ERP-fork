import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "./useDebounce";
import { TOrder, TOrdersPrompt } from "@/types/Order";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getOrders } from "@/services/order-service";
import toast from "react-hot-toast";
import { OrderService } from "@/services";
import { TError } from "@/types/TError";
import { handleApiError } from "@/helper/error-function";
import useAccessStore from "./useAccessStore";
import { getStartOfToday, getEndOfToday } from "@/helper/date-format";
import { TDateRange } from "@/types/Date";


const useOrders = () => {
	const navigate = useNavigate();
	const [pageSize, setPageSize] = useState(10);
	const [search, setSearch] = useState("");
	const [pageNo, setPageNo] = useState(1);
	const [loading, setLoading] = useState(false);
	const [prompt, setPrompt] = useState<TOrdersPrompt>();
	const [orderItemsModal, setOrderItemsModal] = useState({
		open: false,
		_id: "",
	});
	const [dateRange, setDateRange] = useState<TDateRange>({
		from: getStartOfToday(),
		to: getEndOfToday(),
	});
	const [historyModal, setHistoryModal] = useState({
		open: false,
		_id: "",
		order_no: 0,
	});
	const { userId } = useAccessStore((state) => state);
	const debounceSearch = useDebounce(search);

	const { data, error, isLoading, isError, refetch } = useQuery({
		queryKey: [
			"orders",
			pageNo,
			pageSize,
			debounceSearch,
			dateRange.from,
			dateRange.to,
		],
		queryFn: () =>
			getOrders(pageNo, pageSize, debounceSearch, dateRange.from, dateRange.to),
	});

	if (isError)
		handleApiError(error as unknown as TError, "Oops! something went wrong");

	const handleChangePageSize = (size: number) => {
		setPageSize(size);
		setPageNo(1);
	};

	const handleNextPage = () => {
		if (!data || pageNo >= data?.total_pages) return;
		setPageNo(pageNo + 1);
	};

	const handlePrevPage = () => {
		if (pageNo <= 1) return;

		setPageNo(pageNo - 1);
	};

	const handleLastPage = () => {
		if (!data || pageNo === data?.total_pages) return;

		setPageNo(data?.total_pages);
	};

	const handleFirstPage = () => {
		if (pageNo === 1) return;

		setPageNo(1);
	};

	const handleOpenPrompt = (data: Partial<TOrder>) => {
		setPrompt({
			data,
			open: true,
		});
	};

	const handleCancelPrompt = () => {
		setPrompt({
			data: {},
			open: false,
		});
	};

	const handleSumbitPrompt = () => {
		if (prompt?.data?._id && prompt?.data?.status) {
			setLoading(true);
			handleCancelPrompt();
			updateStatusMutation.mutate({
				_id: prompt?.data?._id,
				status: prompt?.data?.status === "cancelled" ? "drafted" : "cancelled",
				user_id: userId!,
			});
		}
	};

	const updateStatusMutation = useMutation({
		mutationFn: OrderService.updateOrderStatus,
		onSuccess: handleUpdateStatusSuccess,
		onError: handleUpdateStatusError,
	});

	function handleUpdateStatusSuccess() {
		toast.success("Order status updated successfully.");
		refetch();
		setLoading(false);
	}

	function handleUpdateStatusError(error: TError) {
		handleApiError(error, "Failed to update order status. Please try again.");
		setLoading(false);
	}

	const isTableLoader = loading || isLoading;
	const isCustomerLoader = loading || updateStatusMutation?.isPending;
	const isPaginationData = data?.total_rows && data?.from && data?.to;

	return {
		search,
		isPaginationData,
		isCustomerLoader,
		isTableLoader,
		data,
		pageNo,
		pageSize,
		prompt,
		orderItemsModal,
		dateRange,
		historyModal,
		navigate,
		setSearch,
		handleNextPage,
		handlePrevPage,
		handleLastPage,
		handleChangePageSize,
		handleFirstPage,
		handleOpenPrompt,
		handleCancelPrompt,
		handleSumbitPrompt,
		setOrderItemsModal,
		setDateRange,
		setHistoryModal,
	};
};
export default useOrders;
