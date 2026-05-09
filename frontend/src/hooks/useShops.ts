import { useState } from 'react';
import { useDebounce } from './useDebounce';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getShops, deleteShop } from '@/services/shop-service';
import toast from 'react-hot-toast';
import { TError } from '@/types/TError';
import { handleApiError } from '@/helper/error-function';
import { TGetShopsResponse, TShop } from '@/types/Shops';
import { socialIconMap } from "@/helper/shopify-utils";

const useShops = () => {
  const [pageSize, setPageSize] = useState(10);
  const [pageNo, setPageNo] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  const debounceSearch = useDebounce(search);
  const { data, error, isLoading, isError, refetch } = useQuery<
    TGetShopsResponse,
    TError
  >({
    queryKey: ['shops', pageNo, pageSize, debounceSearch],
    queryFn: () => getShops(pageNo, pageSize, undefined, debounceSearch),
  });

  if (isError && error) handleApiError(error, 'Oops! something went wrong');

  const paginatedData: TShop[] = data?.shops || [];
  const totalRows: number = data?.total_rows || 0;
  const totalPages: number = data?.total_pages || 0;
  const handleChangePageSize = (size: number) => {
    setPageSize(size);
    setPageNo(1);
  };
  const handleNextPage = () => {
    if (pageNo < totalPages) setPageNo(pageNo + 1);
  };
  const handlePrevPage = () => {
    if (pageNo > 1) setPageNo(pageNo - 1);
  };
  const handleFirstPage = () => setPageNo(1);
  const handleLastPage = () => {
    if (pageNo < totalPages) setPageNo(totalPages);
  };
  const handleDeleteShop = (id?: string) => {
    if (id) {
      setLoading(true);
      deleteShopMutation.mutate(id);
    }
  };
  const deleteShopMutation = useMutation({
    mutationFn: deleteShop,
    onSuccess: () => {
      toast.success('Shop deleted successfully.');
      refetch();
      setLoading(false);
    },
    onError: (err: TError) => {
      handleApiError(err, 'Failed to delete shop. Please try again.');
      setLoading(false);
    },
  });
  const handleReset = () => {
    setSearch('');
    if (pageNo !== 1) setPageNo(1);
    refetch();
  };

  const isTableLoader = isLoading;
  const isCustomerLoader = loading;

  return {
    paginatedData,
    totalRows,
    totalPages,
    pageNo,
    pageSize,
    search,
    hoveredRow,
    setHoveredRow,
    setSearch,
    handleChangePageSize,
    handleNextPage,
    handlePrevPage,
    handleFirstPage,
    handleLastPage,
    handleReset,
    handleDeleteShop,
    isLoading,
    loading,
    isTableLoader,
    isCustomerLoader,
    deleteShopMutation,
    refetch,
    socialIconMap,
  };
};

export default useShops;
