import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from './useDebounce';
import { useQuery } from '@tanstack/react-query';
import { CourierService } from '@/services';
import { TCourierPromptState } from '@/types/Courier';
import { TError } from '@/types/TError';
import { handleApiError } from '@/helper/error-function';

const useCouriers = () => {
  const navigate = useNavigate();
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [pageNo, setPageNo] = useState(1);
  const [prompt, setPrompt] = useState<TCourierPromptState>({
    open: false,
  });
  const loading = false;

  const debounceSearch = useDebounce(search);

  const { data, error, isLoading, isError, refetch } = useQuery({
    queryKey: ['couriers', pageNo, pageSize, debounceSearch],
    queryFn: () => CourierService.getCouriers(pageNo, pageSize, debounceSearch),
  });

  if (isError)
    handleApiError(error as unknown as TError, 'Oops! something went wrong');

  const couriersData = data?.data || [];

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

  const isTableLoader = loading || isLoading;
  const isCustomerLoader = loading;
  const isPaginationData = couriersData && couriersData.length > 0;

  // Delete logic and prompt handlers
  const deleteCourier = async (id: string) => {
    await CourierService.deleteCourier(id);
    setPrompt({ open: false });
    await refetch();
  };

  const handleSumbitPrompt = async () => {
    if (prompt.data) {
      await deleteCourier(prompt.data._id);
    }
  };

  const handleCancelPrompt = () => setPrompt({ open: false });

  return {
    search,
    isPaginationData,
    isCustomerLoader,
    isTableLoader,
    couriersData,
    pageNo,
    pageSize,
    navigate,
    setSearch,
    handleNextPage,
    handlePrevPage,
    handleLastPage,
    handleChangePageSize,
    handleFirstPage,
    prompt,
    setPrompt,
    handleSumbitPrompt,
    handleCancelPrompt,
  };
};

export default useCouriers;
