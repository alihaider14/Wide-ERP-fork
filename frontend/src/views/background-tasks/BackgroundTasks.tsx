import {CustomTable, Layout, TableRowLoader} from "@/components";
import {TableCell, TableRow} from "@/components/ui/table";
import {DateRangePicker} from "@/components/custom/DatePickerRange";
import {BACKGROUND_TASKS_HEAD_DATA} from "@/constant/tableData";
import useBackgroundTasks from "@/hooks/useBackgroundTasks";
import {format} from "date-fns";
import TaskStatusSelect from "@/components/custom/TaskStatusSelect";

const BackgroundTasks = () => {
  const {
    search,
    setSearch,
    dateRange,
    handleDateRangeChange,
    rowsPerPage,
    paginatedBackgroundTasks,
    paginationText,
    handleChangePageSize,
    handleNextPage,
    handlePrevPage,
    handleFirstPage,
    handleLastPage,
    disabledPagination,
    isTableLoader,
    toggleStatus,
  } = useBackgroundTasks();

  return (
    <Layout headerTitle="Background Tasks">
      <CustomTable
        head={BACKGROUND_TASKS_HEAD_DATA}
        searchValue={search}
        onChangeSearch={(e) => setSearch(e.target.value)}
        searchPlaceholder="Search by name, p.no or paid amount"
        rightComponent={
          <DateRangePicker
            initialValue={dateRange}
            onDateRangeChange={handleDateRangeChange}
            className="min-w-[200px] h-9 rounded-[3px] border py-1.5 px-4 gap-3 opacity-100"
          />
        }
        remaining={paginationText}
        pageSize={rowsPerPage}
        handleChangePageSize={handleChangePageSize}
        handleNextPage={handleNextPage}
        handlePrevPage={handlePrevPage}
        handleFirstPage={handleFirstPage}
        handleLastPage={handleLastPage}
        disabledPagination={disabledPagination}
      >
        {isTableLoader ? (
          <TableRowLoader
            rowsNum={10}
            cellsNum={BACKGROUND_TASKS_HEAD_DATA.length}
          />
        ) : paginatedBackgroundTasks.length > 0 ? (
          paginatedBackgroundTasks.map((backgroundTask) => (
            <TableRow
              key={backgroundTask._id}
              className="border-b border-border transition-colors hover:bg-gray-50"
            >
              <TableCell className="pl-5 md:pl-10">
                {backgroundTask.task_no}
              </TableCell>
              <TableCell>{backgroundTask.note}</TableCell>
              <TableCell>{backgroundTask.type}</TableCell>
              <TableCell>
                <TaskStatusSelect
                  status={backgroundTask.status}
                  taskId={backgroundTask._id}
                  onSuccess={(newStatus) =>
                    toggleStatus({id: backgroundTask._id, status: newStatus as "Active" | "Paused"})
                  }
                />
              </TableCell>
              <TableCell>
                {backgroundTask.last_run_at
                  ? format(new Date(backgroundTask.last_run_at), "MMM d, yyyy | hh:mm a")
                  : "-"}
              </TableCell>
              <TableCell>
                {backgroundTask.createdAt
                  ? format(new Date(backgroundTask.createdAt), "MMM d, yyyy | hh:mm a")
                  : "-"}
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell
              colSpan={BACKGROUND_TASKS_HEAD_DATA.length}
              className="text-center py-8"
            >
              No Background Tasks Found
            </TableCell>
          </TableRow>
        )}
      </CustomTable>
    </Layout>
  );
};

export default BackgroundTasks;