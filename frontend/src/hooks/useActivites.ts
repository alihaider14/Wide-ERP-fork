import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ActivityService } from '@/services';
import { format } from 'date-fns';
import { TDateRange } from '@/types/Date';

const useActivities = () => {
    const [search, setSearch] = useState('');
    const [dateRange, setDateRange] = useState<TDateRange>(() => {
        const today = new Date();
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(today.getMonth() - 1);
        return {
            from: oneMonthAgo,
            to: today,
        };
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const fromDate = dateRange.from ? format(dateRange.from, 'yyyy-MM-dd') : undefined;
    const toDate = dateRange.to ? format(dateRange.to, 'yyyy-MM-dd') : undefined;

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['activities', currentPage, rowsPerPage, fromDate, toDate],
        queryFn: () => ActivityService.getActivities({
            page: currentPage,
            size: rowsPerPage,
            from: fromDate,
            to: toDate,
        }),
    });

    const allActivities = data?.data || [];
    const filteredActivities = allActivities.filter((activity) =>
        activity.activites.toLowerCase().includes(search.toLowerCase()) ||
        activity.date_time.toLowerCase().includes(search.toLowerCase())
    );

    const totalPages = data?.total_pages || 1;
    const totalResults = data?.total || 0;

    const handleDateRangeChange = (range: TDateRange) => {
        setDateRange(range);
        setCurrentPage(1); 
    };

    const handleChangePageSize = (size: number) => {
        setRowsPerPage(size);
        setCurrentPage(1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleFirstPage = () => {
        setCurrentPage(1);
    };

    const handleLastPage = () => {
        setCurrentPage(totalPages);
    };

    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = Math.min(startIndex + rowsPerPage, totalResults);
    const paginationText = totalResults > 0 
        ? `${startIndex + 1} - ${endIndex} of ${totalResults}` 
        : '0 - 0 of 0';

    const disabledPagination = {
        first: currentPage === 1,
        prev: currentPage === 1,
        next: currentPage === totalPages || totalResults === 0,
        last: currentPage === totalPages || totalResults === 0,
    };

    const isTableLoader = isLoading;

    return {
        search,
        setSearch,
        dateRange,
        handleDateRangeChange,
        currentPage,
        rowsPerPage,
        paginatedActivities: filteredActivities,
        filteredActivities,
        totalPages,
        totalResults,
        paginationText,
        handleChangePageSize,
        handleNextPage,
        handlePrevPage,
        handleFirstPage,
        handleLastPage,
        disabledPagination,
        isLoading,
        isTableLoader,
        isError,
        error,
    };
};

export default useActivities;
