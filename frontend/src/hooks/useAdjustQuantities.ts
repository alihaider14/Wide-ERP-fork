import { handleApiError } from "@/helper/error-function";
import { useDebounce } from "@/hooks/useDebounce";
import { ProductService, ReduceQtyLogService } from "@/services";
import { getProductQuantities } from "@/services/adjust-qty-service";
import { TReduceQtyLog } from "@/types/ReduceQtyLog";
import { TError } from "@/types/TError";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import useAccessStore from "./useAccessStore";

const useAdjustQuantities = () => {
  const navigate = useNavigate();
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const debounceSearch = useDebounce(search);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const [reduceQtyModal, setReduceQtyModal] = useState({
    open: false,
    _id: "",
  });
  const [historyModal, setHistoryModal] = useState({
    open: false,
    _id: "",
    count: 0,
  });
  const { userId } = useAccessStore((state) => state);

  const [reduceQtyData, setReduceQtyData] = useState<Partial<TReduceQtyLog>>(
    {},
  );

  const handleChange =
    (setter: React.Dispatch<React.SetStateAction<Partial<TReduceQtyLog>>>) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setter((prev) => ({
        ...prev,
        [event.target.name]: event.target.value,
      }));
    };

  const { data: productData, isLoading: isProductDataLoading } = useQuery({
    queryKey: [`productById/${id}`, id],
    queryFn: () => ProductService.productById(id),
    enabled: !!id,
  });

  const { data, error, isLoading, isError, refetch } = useQuery({
    queryKey: ["adjustQuantities", pageNo, pageSize, id, debounceSearch],
    queryFn: () => getProductQuantities(pageNo, pageSize, id!, debounceSearch),
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

  // Reduce qty Mutation
  const reduceQtyMutation = useMutation({
    mutationFn: ReduceQtyLogService.reduceQty,
    onSuccess: handleReduceQtySuccess,
    onError: handleReduceQtyError,
  });

  const handleReduceQty = () => {
    if (
      reduceQtyData?.reason &&
      reduceQtyData?.quantity &&
      userId
    ) {
      setLoading(true);

      reduceQtyMutation.mutate({
        ...reduceQtyData,
        adjustment_id: reduceQtyModal?._id,
        updated_by: userId,
      });

      setReduceQtyModal({
        open: false,
        _id: "",
      });
    } else {
      toast.error("Please fill the required field");
    }
  };

  function handleReduceQtySuccess() {
    toast.success("Qty reduced successfully.");
    setLoading(false);
    setReduceQtyData({});
    refetch();
  }

  function handleReduceQtyError(error: TError) {
    setLoading(false);

    handleApiError(error, "Failed to reduce qty. Please try again.");
  }

  const isPaginationData = data?.total_rows && data?.from && data?.to;

  return {
    isTableLoader: isLoading,
    isCustomerLoader: isProductDataLoading || loading,
    data,
    productData,
    isPaginationData,
    pageNo,
    pageSize,
    search,
    reduceQtyModal,
    reduceQtyData,
    historyModal,
    navigate,
    setSearch,
    handleNextPage,
    handlePrevPage,
    handleLastPage,
    handleChangePageSize,
    handleFirstPage,
    setReduceQtyModal,
    handleChange,
    setReduceQtyData,
    handleReduceQty,
    setHistoryModal,
  };
};
export default useAdjustQuantities;
