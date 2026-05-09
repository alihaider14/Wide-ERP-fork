import {getBackgroundTasks} from "@/services/background-tasks.service";
import {updateBackgroundTaskStatus} from "@/services/background-tasks.service";
import {useState} from "react";
import {format} from "date-fns";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {DateRange} from "@/components/custom/DatePickerRange";

const useBackgroundTasks = () => {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState<DateRange>(() => {
    const today = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(today.getMonth() - 1);
    return {from: oneMonthAgo, to: today};
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fromDate = dateRange.from ? format(dateRange.from, "yyyy-MM-dd") : undefined;
  const toDate = dateRange.to ? format(dateRange.to, "yyyy-MM-dd") : undefined;

  const {data, isLoading} = useQuery({
    queryKey: ["backgroundTasks", currentPage, rowsPerPage, fromDate, toDate, search],
    queryFn: () =>
      getBackgroundTasks({
        page: currentPage,
        size: rowsPerPage,
        from: fromDate,
        to: toDate,
        search,
      }),
  });

  const tasks = data?.tasks || [];

  const totalResults = data?.total || 0;
  const totalPages = data?.total_pages || 1;

  const {mutate: toggleStatus} = useMutation({
    mutationFn: updateBackgroundTaskStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["backgroundTasks"]});
    },
  });

  const handleDateRangeChange = (range: DateRange) => {
    setDateRange(range);
    setCurrentPage(1);
  };

  const handleChangePageSize = (size: number) => {
    setRowsPerPage(size);
    setCurrentPage(1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleFirstPage = () => setCurrentPage(1);
  const handleLastPage = () => setCurrentPage(totalPages);

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, totalResults);
  const paginationText =
    totalResults > 0 ? `${startIndex + 1} - ${endIndex} of ${totalResults}` : "0 - 0 of 0";

  const disabledPagination = {
    first: currentPage === 1,
    prev: currentPage === 1,
    next: currentPage === totalPages || totalResults === 0,
    last: currentPage === totalPages || totalResults === 0,
  };

  return {
    search,
    setSearch,
    dateRange,
    handleDateRangeChange,
    currentPage,
    rowsPerPage,
    paginatedBackgroundTasks: tasks,
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
    isTableLoader: isLoading,
    toggleStatus,
  };
};

export default useBackgroundTasks;