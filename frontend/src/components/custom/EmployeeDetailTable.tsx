import { Button } from "@/components/ui/button";
import {
	Pagination,
	PaginationContent,
	PaginationFirst,
	PaginationItem,
	PaginationLast,
	PaginationNext,
	PaginationPrevious,
	SelectRowsPerPage,
} from "@/components/ui/pagination";
import { COLOR } from "@/constant/Colors";
import { TEmployeeDetailTableProps } from "@/types/Employee";
import { DateRangePicker } from "./DatePickerRange";
import SimpleTable from "./SimpleTable";

const EmployeeDetailTable = ({
	head,
	children,
	dateRange,
	onDateRangeChange,
	onClickPaySalary,
	disablePaySalary,
	pageSize,
	handleChangePageSize,
	remaining,
	handleFirstPage,
	handlePrevPage,
	handleNextPage,
	handleLastPage,
	disabledPagination,
}: TEmployeeDetailTableProps) => {
	return (
		<div className='rounded-[5px] border border-border bg-white'>
			<div className='flex flex-col gap-4 border-b border-border p-5 lg:flex-row lg:items-center lg:justify-between'>
				<DateRangePicker
					initialValue={dateRange}
					onDateRangeChange={onDateRangeChange}
					className='flex-nowrap whitespace-nowrap w-full rounded-[3px] border py-1.5 px-4 gap-3 h-9 lg:max-w-[270px]'
				/>

				<Button
					className='h-9 w-full rounded-[3px] lg:w-[192px]'
					style={{ backgroundColor: COLOR.blue }}
					onClick={onClickPaySalary}
					disabled={disablePaySalary}
				>
					Pay Salary
				</Button>
			</div>

			<div className='flex items-center justify-end w-full min-h-[50px] md:px-[20px] px-5 flex-wrap border-b border-border gap-2'>
				<div className='flex w-full items-center justify-end gap-2 flex-wrap lg:w-auto lg:gap-[50px]'>
					<SelectRowsPerPage
						options={[10, 20]}
						setPageSize={handleChangePageSize}
						pageSize={pageSize}
					/>

					<span
						className='text-sm tracking-[0.02em] whitespace-nowrap shrink-0'
						style={{ color: COLOR.semiBlack }}
					>
						{remaining}
					</span>

					<Pagination className='-mr-2'>
						<PaginationContent>
							<PaginationItem>
								<PaginationFirst
									onClick={handleFirstPage}
									color={
										disabledPagination.first
											? COLOR.offWhite
											: COLOR.lightBlack
									}
									className={
										disabledPagination.first
											? "cursor-default hover:bg-transparent"
											: undefined
									}
								/>
							</PaginationItem>
							<PaginationItem>
								<PaginationPrevious
									onClick={handlePrevPage}
									color={
										disabledPagination.prev
											? COLOR.offWhite
											: COLOR.lightBlack
									}
									className={
										disabledPagination.prev
											? "cursor-default hover:bg-transparent"
											: undefined
									}
								/>
							</PaginationItem>
							<PaginationItem>
								<PaginationNext
									onClick={handleNextPage}
									color={
										disabledPagination.next
											? COLOR.offWhite
											: COLOR.lightBlack
									}
									className={
										disabledPagination.next
											? "cursor-default hover:bg-transparent"
											: undefined
									}
								/>
							</PaginationItem>
							<PaginationItem>
								<PaginationLast
									onClick={handleLastPage}
									color={
										disabledPagination.last
											? COLOR.offWhite
											: COLOR.lightBlack
									}
									className={
										disabledPagination.last
											? "cursor-default hover:bg-transparent"
											: undefined
									}
								/>
							</PaginationItem>
						</PaginationContent>
					</Pagination>
				</div>
			</div>

			<SimpleTable
				head={head}
				headerRowHeight='50px'
				bodyRowHeight='50px'
				bodyCellPaddingY='0px'
			>
				{children}
			</SimpleTable>
		</div>
	);
};

export default EmployeeDetailTable;
