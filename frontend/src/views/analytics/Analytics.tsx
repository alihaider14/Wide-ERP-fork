import { Layout, CustomTable, TableRowLoader } from "@/components";
import { TableCell, TableRow } from "@/components/ui/table";
import AnalyticsTableRow from "@/components/custom/AnalyticsTableRow";
import AnalyticsSummary from "@/components/custom/AnalyticsSummary";
import { DateRangePicker } from "@/components/custom/DatePickerRange";
import useAnalytics from "@/hooks/useAnalytics";

const Analytics = () => {
	const {
		search,
		setSearch,
		orderedRows,
		allShopIds,
		hoveredRow,
		setHoveredRow,
		summaryData,
		dateRange,
		isLoading,
		handleToggleSelect,
		handleDateRangeChange,
		ANALYTICS_HEAD,
		colCount,
	} = useAnalytics();

	return (
		<Layout
			headerTitle='Analytics'
			mainLayoutContainerClassName='md:px-10 md:py-8'
		>
			<AnalyticsSummary
				totalSales={summaryData.totalSales}
				avgSales={summaryData.avgSales}
				totalOrders={summaryData.totalOrders}
				avgOrders={summaryData.avgOrders}
				totalSpent={summaryData.totalSpent}
				avgSpent={summaryData.avgSpent}
				totalROAS={summaryData.totalROAS}
				avgROAS={summaryData.avgROAS}
			/>

			<CustomTable
				head={ANALYTICS_HEAD}
				headerRowHeight='50px'
				bodyRowHeight='50px'
				bodyCellPaddingY='0px'
				searchValue={search}
				onChangeSearch={(e) => setSearch(e.target.value)}
				searchPlaceholder='Search'
				rightComponent={
					<DateRangePicker
						initialValue={dateRange}
						onDateRangeChange={handleDateRangeChange}
						className='min-w-[251px] h-9 rounded-[3px] border py-1.5 px-4 gap-3 opacity-100'
					/>
				}
				hidePagination={true}
				handleChangePageSize={() => {}}
				disabledPagination={{
					first: true,
					prev: true,
					next: true,
					last: true,
				}}
			>
				{isLoading && allShopIds.length === 0 ? (
					<TableRowLoader rowsNum={10} cellsNum={colCount} />
				) : allShopIds.length === 0 ? (
					<TableRow>
						<TableCell colSpan={colCount} className='text-center'>
							No Analytics Data Found
						</TableCell>
					</TableRow>
				) : (
					orderedRows.map((row, i) => {
						if (!row) {
							return (
								<TableRowLoader
									key={allShopIds[i]}
									rowsNum={1}
									cellsNum={colCount}
								/>
							);
						}
						if (
							search &&
							!row.shop.toLowerCase().includes(search.toLowerCase())
						) {
							return null;
						}
						const isHovered = hoveredRow === String(row._id);
						return (
							<AnalyticsTableRow
								key={row._id}
								analytics={row}
								isHovered={isHovered}
								onMouseEnter={() => setHoveredRow(String(row._id))}
								onMouseLeave={() => setHoveredRow(null)}
								onToggleSelect={handleToggleSelect}
							/>
						);
					})
				)}
			</CustomTable>
		</Layout>
	);
};
export default Analytics;
