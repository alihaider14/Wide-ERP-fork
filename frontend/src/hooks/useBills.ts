import { useState } from "react";
import { useDebounce } from "./useDebounce";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getBills, deleteBill, getBillById } from "../services/bill-service";
import type { BillDeleteTarget, BillDetails, BillItem, BillListItem, BillsQueryResult } from "../types/bill";
import { TError } from "@/types/TError";
import { handleApiError } from "@/helper/error-function";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { TDateRange } from "@/types/Date";

const useBills = () => {
	const [search, setSearch] = useState("");
	const [pageNo, setPageNo] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	const [loading, setLoading] = useState(false);
	const [dateRange, setDateRange] = useState<TDateRange>(() => {
		const today = new Date();
		return { from: today, to: today };
	});
	const [hoveredRow, setHoveredRow] = useState<string | null>(null);
	const [modalOpen, setModalOpen] = useState(false);
	const [modalItems, setModalItems] = useState<BillItem[]>([]);
	const [modalLoading, setModalLoading] = useState(false);
	const [deleteModalOpen, setDeleteModalOpen] = useState(false);
	const [billToDelete, setBillToDelete] = useState<BillDeleteTarget | null>(null);
	const debounceSearch = useDebounce(search);

	const startDate = dateRange.from ? format(dateRange.from, "yyyy-MM-dd") : "";
	const endDate = dateRange.to ? format(dateRange.to, "yyyy-MM-dd") : "";

	const { data, error, isLoading, isError, refetch } = useQuery<
		BillsQueryResult,
		TError
	>({
		queryKey: ["bills", pageNo, pageSize, debounceSearch, startDate, endDate],
		queryFn: () => getBills(pageNo, pageSize, debounceSearch, startDate, endDate),
	});

	if (isError) handleApiError(error as TError, "Oops! something went wrong");

	const handleChangePageSize = (size: number) => {
		setPageSize(size);
		setPageNo(1);
	};

	const handleDateRangeChange = (range: Partial<TDateRange>) => {
		setDateRange({ from: range.from, to: range.to });
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

	const isPaginationData = data?.total_rows && data?.from && data?.to;

	const isTableLoader = isLoading;

	const deleteBillMutation = useMutation({
		mutationFn: deleteBill,
		onSuccess: (data) => {
			toast.success(data.message || "Bill deleted successfully.");
			refetch();
			setLoading(false);
			setDeleteModalOpen(false);
			setBillToDelete(null);
		},
		onError: (err: TError) => {
			handleApiError(err, "Failed to delete bill. Please try again.");
			setLoading(false);
			setDeleteModalOpen(false);
		},
	});

	const handleDeleteBill = (billId: string, billNumber: string, vendorName: string) => {
		setBillToDelete({ id: billId, billNumber, vendorName });
		setDeleteModalOpen(true);
	};

	const confirmDeleteBill = () => {
		if (billToDelete) {
			setLoading(true);
			deleteBillMutation.mutate(billToDelete.id);
		}
	};

	const cancelDeleteBill = () => {
		setDeleteModalOpen(false);
		setBillToDelete(null);
	};

	const handleShowBillItems = async (billId: string) => {
		setModalLoading(true);

		try {
			const bill = data?.bills?.find((b) => b._id === billId);

			if (bill && Array.isArray(bill.items)) {
				setModalItems(bill.items as BillItem[]);
			} else {
				const billDetails = (await getBillById(billId)) as Partial<
					BillDetails & BillListItem
				>;

				setModalItems((billDetails.items as BillItem[]) || []);
			}
		} catch {
			setModalItems([]);
		} finally {
			setModalLoading(false);
			setModalOpen(true);
		}
	};
	return {
		search,
		setSearch,
		dateRange,
		handleDateRangeChange,
		pageNo,
		pageSize,
		handleNextPage,
		handlePrevPage,
		handleLastPage,
		handleFirstPage,
		handleChangePageSize,
		paginatedData: data?.bills || [],
		data,
		isTableLoader,
		isPaginationData,
		todayPurchasing: data?.today_purchasing || 0,
		refetch,
		handleDeleteBill,
		confirmDeleteBill,
		cancelDeleteBill,
		loading,
		deleteBillMutation,
		hoveredRow,
		setHoveredRow,
		modalOpen,
		setModalOpen,
		modalItems,
		modalLoading,
		handleShowBillItems,
		deleteModalOpen,
		billToDelete,
	};
};
export default useBills;
