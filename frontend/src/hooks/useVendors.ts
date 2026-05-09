import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from './useDebounce';
import { useQuery } from '@tanstack/react-query';
import { VendorService } from '@/services';
import { TError } from '@/types/TError';
import { handleApiError } from '@/helper/error-function';

const useVendors = () => {
    const navigate = useNavigate();
    const [pageSize, setPageSize] = useState(10);
    const [search, setSearch] = useState('');
    const [pageNo, setPageNo] = useState(1);
    const loading = false;

    const debounceSearch = useDebounce(search);

    const { data, error, isLoading, isError } = useQuery({
        queryKey: ['vendors', pageNo, pageSize, debounceSearch],
        queryFn: () => VendorService.getVendors(pageNo, pageSize, debounceSearch),
    });

    if (isError)
        handleApiError(error as unknown as TError, 'Oops! something went wrong');

    const vendorsData = data?.vendors || [];

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
    const isPaginationData = vendorsData && vendorsData.length > 0;

    return {
        search,
        isPaginationData,
        isCustomerLoader,
        isTableLoader,
        vendorsData,
        pageNo,
        pageSize,
        navigate,
        setSearch,
        handleNextPage,
        handlePrevPage,
        handleLastPage,
        handleChangePageSize,
        handleFirstPage,
    };
};

export default useVendors;
