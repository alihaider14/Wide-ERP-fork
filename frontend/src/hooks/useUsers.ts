import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from './useDebounce';
import { useMutation, useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { getUsers } from '@/services/user-service';
import { UserService } from '@/services';
import { TError } from '@/types/TError';
import { handleApiError } from '@/helper/error-function';
import { TUser, TUsersPrompt } from '@/types/User';

const useUsers = () => {
  const navigate = useNavigate();
  const [pageSize, setPageSize] = useState(10);
  const [prompt, setPrompt] = useState<TUsersPrompt>();
  const [search, setSearch] = useState('');
  const [pageNo, setPageNo] = useState(1);
  const [loading, setLoading] = useState(false);
  const [accessPopUp, setAccessPopUp] = useState({
    open: false,
    data: {} as TUser,
  });

  const debounceSearch = useDebounce(search);

  const { data, error, isLoading, isError, refetch } = useQuery({
    queryKey: ['users', pageNo, pageSize, debounceSearch],
    queryFn: () => getUsers(pageNo, pageSize, debounceSearch),
  });

  if (isError)
    handleApiError(error as unknown as TError, 'Oops! something went wrong');

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

  const handleOpenPrompt = (data: Partial<TUser>) => {
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
    if (prompt?.data?._id) {
      setLoading(true);
      handleCancelPrompt();
      deleteUserMutation.mutate(prompt?.data?._id);
    }
  };

  const deleteUserMutation = useMutation({
    mutationFn: UserService.deleteUser,
    onSuccess: handleDeleteUserSuccess,
    onError: handleDeleteUserError,
  });

  function handleDeleteUserSuccess() {
    toast.success('User deleted successfully.');
    refetch();
    setLoading(false);
  }

  function handleDeleteUserError(error: TError) {
    handleApiError(error, 'Failed to delete User. Please try again.');
    setLoading(false);
  }

  const isTableLoader = loading || isLoading;
  const isCustomerLoader = loading || deleteUserMutation?.isPending;
  const isPaginationData = data?.total_rows && data?.from && data?.to;

  return {
    search,
    isPaginationData,
    isCustomerLoader,
    isTableLoader,
    data,
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
export default useUsers;
