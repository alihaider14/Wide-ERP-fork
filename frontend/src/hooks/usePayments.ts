import { useState } from "react";
import { useDebounce } from "./useDebounce";
import { useMutation, useQuery } from "@tanstack/react-query";
import { deletePayment, getPayments } from "../services/payment-service";
import type { PaymentDeleteTarget, PaymentsQueryResult } from "../types/payment";
import { TError } from "@/types/TError";
import { handleApiError } from "@/helper/error-function";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { TDateRange } from "@/types/Date";

const usePayments = () => {
  const [search, setSearch] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [dateRange, setDateRange] = useState<TDateRange>(() => {
    const today = new Date();
    return { from: today, to: today };
  });
  const [loading, setLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [paymentToDelete, setPaymentToDelete] = useState<PaymentDeleteTarget | null>(null);
  const debounceSearch = useDebounce(search);
  const startDate = dateRange.from ? format(dateRange.from, "yyyy-MM-dd") : "";
  const endDate = dateRange.to ? format(dateRange.to, "yyyy-MM-dd") : "";

  const { data, error, isLoading, isFetching, isError, refetch } = useQuery<
    PaymentsQueryResult,
    TError
  >({
    queryKey: ["payments", pageNo, pageSize, debounceSearch, startDate, endDate],
    queryFn: () => getPayments(pageNo, pageSize, debounceSearch, startDate, endDate),
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
  const isTableLoader = isLoading || isFetching;
  const paginatedData = data?.payments || [];

  const deletePaymentMutation = useMutation({
    mutationFn: deletePayment,
    onSuccess: (response) => {
      toast.success(response.message || "Payment deleted successfully.");
      refetch();
      setLoading(false);
      setDeleteModalOpen(false);
      setPaymentToDelete(null);
    },
    onError: (err: TError) => {
      handleApiError(err, "Failed to delete payment. Please try again.");
      setLoading(false);
      setDeleteModalOpen(false);
    },
  });

  const handleDeletePayment = (
    paymentId: string,
    paymentNo: string,
    vendorName: string
  ) => {
    setPaymentToDelete({ id: paymentId, paymentNo, vendorName });
    setDeleteModalOpen(true);
  };

  const confirmDeletePayment = () => {
    if (paymentToDelete) {
      setLoading(true);
      deletePaymentMutation.mutate(paymentToDelete.id);
    }
  };

  const cancelDeletePayment = () => {
    setDeleteModalOpen(false);
    setPaymentToDelete(null);
  };

  return {
    search,
    setSearch,
    dateRange,
    handleDateRangeChange,
    isPaginationData,
    isTableLoader,
    paginatedData,
    pageNo,
    pageSize,
    handleNextPage,
    handlePrevPage,
    handleLastPage,
    handleFirstPage,
    handleChangePageSize,
    data,
    loading,
    refetch,
    handleDeletePayment,
    confirmDeletePayment,
    cancelDeletePayment,
    deleteModalOpen,
    paymentToDelete,
  };
};

export default usePayments;
