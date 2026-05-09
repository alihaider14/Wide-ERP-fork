import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "./useDebounce";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { getStockZones, deleteStockZone } from "@/services/stock-zone-service";
import { TError } from "@/types/TError";
import { handleApiError } from "@/helper/error-function";
import { TUser } from "@/types/User";
import { TStockZonePrompt } from "@/types/StockZone";
import { TStockZone } from "@/types/StockZone";

const useStockZone = () => {
	const navigate = useNavigate();
	const [pageSize, setPageSize] = useState(10);
	const [prompt, setPrompt] = useState<TStockZonePrompt>();
	const [search, setSearch] = useState("");
	const [pageNo, setPageNo] = useState(1);
	const [loading, setLoading] = useState(false);
	const [accessPopUp, setAccessPopUp] = useState({
		open: false,
		data: {} as TUser,
	});

	const debounceSearch = useDebounce(search);

	const { data, error, isLoading, isError, refetch } = useQuery({
		queryKey: ["stock-zones", pageNo, pageSize, debounceSearch],
		queryFn: () => getStockZones(pageNo, pageSize, debounceSearch),
	});

	if (isError)
		handleApiError(error as unknown as TError, "Oops! something went wrong");

	const stockZoneData: TStockZone[] = data?.data || [];

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

	const handleOpenPrompt = (zone: TStockZone) => {
		setPrompt({
			data: zone,
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
		if (prompt?.data?._id) {
			setLoading(true);
			handleCancelPrompt();
			deleteStockZoneMutation.mutate(prompt?.data?._id);
		}
	};

	const deleteStockZoneMutation = useMutation({
		mutationFn: deleteStockZone,
		onSuccess: () => {
			toast.success("Stock zone deleted successfully.");
			refetch();
			setLoading(false);
		},
		onError: (error: TError) => {
			handleApiError(error, "Failed to delete stock zone. Please try again.");
			setLoading(false);
		},
	});

	const isTableLoader = loading || isLoading;
	const isCustomerLoader = loading || deleteStockZoneMutation?.isPending;
	const isPaginationData = stockZoneData && stockZoneData.length > 0;

	return {
		search,
		isPaginationData,
		isCustomerLoader,
		isTableLoader,
		stockZoneData,
		pageNo,
		pageSize,
		accessPopUp,
		prompt,
		navigate,
		setSearch,
		handleNextPage,
		handlePrevPage,
		handleLastPage,
		handleChangePageSize,
		handleFirstPage,
		handleSumbitPrompt,
		setAccessPopUp,
		handleCancelPrompt,
		handleOpenPrompt,
	};
};
export default useStockZone;
