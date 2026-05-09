import { CustomTable, Layout, TableRowLoader } from '@/components';
import { TableCell, TableRow } from '@/components/ui/table';
import { DateRangePicker } from '@/components/custom/DatePickerRange';
import { ACTIVITIES_HEAD_DATA } from '@/constant/tableData';
import useActivities from '@/hooks/useActivites';

const Activities = () => {
    const {
        search,
        setSearch,
        dateRange,
        handleDateRangeChange,
        rowsPerPage,
        paginatedActivities,
        paginationText,
        handleChangePageSize,
        handleNextPage,
        handlePrevPage,
        handleFirstPage,
        handleLastPage,
        disabledPagination,
        isTableLoader,
    } = useActivities();

    return (
        <Layout headerTitle='Activities'>
            
            <CustomTable
                head={ACTIVITIES_HEAD_DATA}
                searchValue={search}
                onChangeSearch={(e) => setSearch(e.target.value)}
                searchPlaceholder="Search"
                rightComponent={
                    <DateRangePicker
                        initialValue={dateRange}
                        onDateRangeChange={handleDateRangeChange}
                        className="min-w-[251px] h-9 rounded-[3px] border py-1.5 px-4 gap-3 opacity-100"
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
                    <TableRowLoader rowsNum={10} cellsNum={ACTIVITIES_HEAD_DATA.length} />
                ) : paginatedActivities.length > 0 ? (
                    paginatedActivities.map((activity) => (
                        <TableRow key={activity._id} className="border-b border-border transition-colors hover:bg-gray-50">
                            <TableCell className="pl-5 md:pl-10">
                                {activity.date_time}
                            </TableCell>
                            <TableCell className="">
                                {activity.activites}
                            </TableCell>
                        </TableRow>
                    ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={ACTIVITIES_HEAD_DATA.length} className="text-center py-8">
                            No Activities Found
                        </TableCell>
                    </TableRow>
                )}
            </CustomTable>
        </Layout>
    );
};

export default Activities;
