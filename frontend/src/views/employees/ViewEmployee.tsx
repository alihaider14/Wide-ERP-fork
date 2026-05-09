import {
	CustomLoader,
	EmployeeDetailTable,
	EmployeeSummaryCard,
	Layout,
	TableIcon,
	TableRowLoader,
	WorkingHoursCard,
} from "@/components";
import NoteTooltip from "@/components/custom/NoteTooltip";
import PaySalaryModal from "@/components/custom/PaySalaryModal";
import { TableCell, TableRow } from "@/components/ui/table";
import { EMPLOYEE_SALARY_HISTORY_HEAD_DATA } from "@/constant/tableData";
import useViewEmployee from "@/hooks/useViewEmployee";
import { Edit, Message } from "@/assets/svg";
import { formatShortMonthDayYear } from "@/helper/date-format";
import { numberFormateToLocalString } from "@/helper/number-formator";
import useAccessStore from "@/hooks/useAccessStore";
import { ACCESS } from "@/constant/Checkbox";

const ViewEmployee = () => {
	const hasAccess = useAccessStore((state) => state.hasAccess);
	const {
		isLoading,
		isTableLoader,
		employee,
		employeeName,
		phoneLabel,
		designationLabel,
		statusLabel,
		baseSalaryLabel,
		experienceLabel,
		dateRange,
		handleDateRangeChange,
		pageNo,
		pageSize,
		handleChangePageSize,
		handleNextPage,
		handlePrevPage,
		handleFirstPage,
		handleLastPage,
		remainingLabel,
		disabledPagination,
		salaryModalOpen,
		handleOpenSalaryModal,
		handleEditSalary,
		handleSalaryModalChange,
		handlePaySalary,
		isSalarySubmitting,
		salaryHistory,
		salaryRecords,
		editingSalary,
	} = useViewEmployee();

	return (
		<Layout
			headerTitle='View Employee'
			buttonLabel='Employees'
			buttonLink='/employees'
		>
			<CustomLoader isLoading={isLoading} />

			<div className='flex flex-col gap-5'>
				<EmployeeSummaryCard
					employeeName={employeeName}
					statusLabel={statusLabel}
					designationLabel={designationLabel}
					phoneLabel={phoneLabel}
					baseSalaryLabel={baseSalaryLabel}
					experienceLabel={experienceLabel}
					attendanceLabel='-'
				/>

				{employee?.working_hours && employee.working_hours.length > 0 && (
					<WorkingHoursCard workingHours={employee.working_hours} />
				)}

				<EmployeeDetailTable
					head={EMPLOYEE_SALARY_HISTORY_HEAD_DATA}
					dateRange={dateRange}
					onDateRangeChange={handleDateRangeChange}
					onClickPaySalary={handleOpenSalaryModal}
					disablePaySalary={!employee || !hasAccess(ACCESS.update_employee)}
					pageSize={pageSize}
					handleChangePageSize={handleChangePageSize}
					remaining={remainingLabel}
					handleFirstPage={handleFirstPage}
					handlePrevPage={handlePrevPage}
					handleNextPage={handleNextPage}
					handleLastPage={handleLastPage}
					disabledPagination={disabledPagination}
				>
					{isTableLoader ? (
						<TableRowLoader
							rowsNum={Math.min(pageSize, 10)}
							cellsNum={EMPLOYEE_SALARY_HISTORY_HEAD_DATA.length}
						/>
					) : salaryHistory.length > 0 ? (
						salaryHistory.map((history, index) => (
							<TableRow key={history._id || `${history.month}-${index}`}>
								<TableCell className='pl-5'>
									<div className='inline-flex h-[21px] w-[112px] items-center gap-[4px]'>
										<span className='flex h-[21px] w-[80px] items-center truncate font-poppins text-[14px] font-normal leading-[100%] tracking-[0]'>
											{history.month}
										</span>
										<span className='flex h-[21px] flex-1 items-center justify-end pr-2'>
											{history.note?.trim() ? (
												<NoteTooltip
													tooltipId={`employee-history-note-${history._id}`}
													note={history.note}
												>
													<img
														src={Message}
														alt='message'
														className='h-[15px] w-[15px] shrink-0 -translate-y-px cursor-pointer'
													/>
												</NoteTooltip>
											) : null}
										</span>
									</div>
								</TableCell>
								<TableCell>{history.on_time}</TableCell>
								<TableCell>{history.late}</TableCell>
								<TableCell>{history.absence}</TableCell>
								<TableCell>{history.leave}</TableCell>
								<TableCell>
									Rs. {numberFormateToLocalString(history.base_salary)}
								</TableCell>
								<TableCell>
									Rs. {numberFormateToLocalString(history.commission)}
								</TableCell>
								<TableCell>
									Rs. {numberFormateToLocalString(history.other)}
								</TableCell>
								<TableCell>{formatShortMonthDayYear(history.paid_at)}</TableCell>
								<TableCell>{formatShortMonthDayYear(history.created_at)}</TableCell>
								<TableCell className='pr-5'>
									<div className='flex justify-start'>
										<TableIcon
											src={Edit}
											alt='edit'
											tooltipId={`view-employee-history-edit-${pageNo}-${index}`}
											data-tooltip-content='Edit'
											className='bg-grey-100'
											disabledBtn={!hasAccess(ACCESS.update_employee)}
											onClick={() => handleEditSalary(salaryRecords[index])}
										/>
									</div>
								</TableCell>
							</TableRow>
						))
					) : (
						<TableRow>
							<TableCell
								colSpan={EMPLOYEE_SALARY_HISTORY_HEAD_DATA.length}
								className='py-8 text-center'
							>
								No employee salary history found
							</TableCell>
						</TableRow>
					)}
				</EmployeeDetailTable>
			</div>

			<PaySalaryModal
				open={salaryModalOpen}
				onOpenChange={handleSalaryModalChange}
				employee={employee}
				onSubmit={handlePaySalary}
				isSubmitting={isSalarySubmitting}
				initialData={editingSalary ? {
					base_salary: editingSalary.base_salary,
					commission: editingSalary.commission,
					other: editingSalary.other,
					payment_month: editingSalary.payment_month,
					paid_at: editingSalary.paid_at,
					note: editingSalary.note || "",
				} : null}
			/>
		</Layout>
	);
};

export default ViewEmployee;
