import {
	CustomLoader,
	CustomTable,
	Layout,
	Prompt,
	TableIcon,
	TableRowLoader,
} from "@/components";
import { TableCell, TableRow } from "@/components/ui/table";
import { EMPLOYEE_HEAD_DATA } from "@/constant/tableData";
import useEmployees from "@/hooks/useEmployees";
import useAccessStore from "@/hooks/useAccessStore";
import { ACCESS } from "@/constant/Checkbox";
import { Edit, EyeOpenIcon, CashBanknoteMove, FingerprintScan } from "@/assets/svg";
import { TEmployee } from "@/types/Employee";
import StatusCell from "@/components/custom/StatusCell";
import PaySalaryModal from "@/components/custom/PaySalaryModal";
import { numberFormateToLocalString } from "@/helper/number-formator";
import { COLOR } from "@/constant/Colors";
import EmployeeStatusSelect from "@/components/custom/EmployeeStatusSelect";
import { formatShortMonthDayYear } from "@/helper/date-format";
import FingerprintModal from "@/components/custom/FingerPrintModal";

const Employees = () => {
	const hasAccess = useAccessStore((state) => state.hasAccess);
	const {
		isCustomerLoader,
		isTableLoader,
		employeesData,
		pageSize,
		navigate,
		handleNextPage,
		handlePrevPage,
		handleLastPage,
		handleChangePageSize,
		handleFirstPage,
		search,
		setSearch,
		prompt,
		handleSumbitPrompt,
		handleCancelPrompt,
		data,
		salaryModal,
		handleOpenSalaryModal,
		handleSalaryModalChange,
		handlePaySalary,
		isSalarySubmitting,
		handleEmployeeStatusChange,
		updatingEmployeeId,
		handleOpenFingerPrintModal,
		handleCloseFingerPrintModal,
		fingerPrintModal,
		handleUpdateFingerPrint
	} = useEmployees();

	return (
		<Layout headerTitle='Employees' buttonLabel='Employees'>
			<CustomLoader isLoading={isCustomerLoader} />
			<Prompt
				open={prompt.open}
				title={`Remove ${prompt.data?.full_name || ""}`}
				description={`Please confirm if you'd like to remove ${prompt.data?.full_name || ""}.`}
				handleSumbit={handleSumbitPrompt}
				handleCancel={handleCancelPrompt}
				cancelButtonText='No, cancel'
				sumbitButtonText='Yes, remove'
				sumbitButtonVariant='destructive'
			/>
			<CustomTable
				searchValue={search}
				searchPlaceholder="Search"
				onChangeSearch={(e) => setSearch(e.target.value)}
				buttonLabel='+ Add Employee'
				head={EMPLOYEE_HEAD_DATA}
				headerRowHeight='50px'
                bodyRowHeight='50px'
                bodyCellPaddingY='0px'
				onClickButton={() => navigate("/add-employee")}
				disabledBtn={!hasAccess(ACCESS.create_employee)}
				remaining={
					employeesData?.length > 0
						? `${data?.from || 1} - ${data?.to || employeesData?.length} of ${data?.total_rows || employeesData?.length}`
						: "0 - 0 of 0"
				}
				handleChangePageSize={handleChangePageSize}
				handleFirstPage={handleFirstPage}
				handleLastPage={handleLastPage}
				handleNextPage={handleNextPage}
				handlePrevPage={handlePrevPage}
				pageSize={pageSize}
				disabledPagination={{
					next: !employeesData?.length || data?.total_pages === 1,
					prev: !employeesData?.length || data?.total_pages === 1,
					first: !employeesData?.length || data?.total_pages === 1,
					last: !employeesData?.length || data?.total_pages === 1,
				}}
			>
				{isTableLoader ? (
					<TableRowLoader rowsNum={10} cellsNum={EMPLOYEE_HEAD_DATA.length} />
				) : employeesData?.length > 0 ? (
					employeesData.map((employee: TEmployee & { _id: string }, index: number) => (
						<TableRow
							key={employee._id || index}
							className='group'
							style={{ height: "50px" }}
						>
							<TableCell className='font-medium ps-7'>
								{employee?.full_name || "N/A"}
							</TableCell>
							<TableCell>{employee?.attendance || "-"}</TableCell>
							<TableCell>{employee?.designation || "N/A"}</TableCell>
							<TableCell>{employee?.phone || "N/A"}</TableCell>
							<TableCell>
								{employee?.last_paid
									? `Rs. ${numberFormateToLocalString(employee.last_payment_amount ?? 0)} | ${formatShortMonthDayYear(employee.last_paid)}`
									: "-"}
							</TableCell>
							<TableCell>{employee?.experience || "N/A"}</TableCell>
							<TableCell>
								{hasAccess(ACCESS.update_employee) ? (
									<EmployeeStatusSelect
										status={employee.status}
										className='w-full'
										disabled={updatingEmployeeId === employee._id}
										onChange={(status) =>
											handleEmployeeStatusChange(employee._id, status)
										}
									/>
								) : (
									<StatusCell status={employee?.status || "N/A"} className="w-full" />
								)}
							</TableCell>
							<TableCell>
								<div className='flex items-center gap-3'>
									<TableIcon
										src={Edit}
										alt='edit'
										tooltipId='edit-tooltip'
										data-tooltip-content='Edit'
										style={{ backgroundColor: COLOR.secondaryGrey }}
										disabledBtn={!hasAccess(ACCESS.update_employee)}
										onClick={() => navigate(`/update-employee/${employee._id}`)}
									/>
									<TableIcon
										iconComponent={<EyeOpenIcon width={24} height={24} color={COLOR.blue} />}
										alt='view'
										tooltipId='view-tooltip'
										data-tooltip-content='View'
										style={{ backgroundColor: COLOR.blueBg }}
										onClick={() => navigate(`/view-employee/${employee._id}`)}
									/>
									<TableIcon
										src={CashBanknoteMove}
										alt='salary'
										tooltipId='salary-tooltip'
										data-tooltip-content='Salary'
										style={{ backgroundColor: COLOR.greenBg }}
										disabledBtn={!hasAccess(ACCESS.update_employee)}
										onClick={() => handleOpenSalaryModal(employee)}
									/>
									<div className="relative">
										{index===0 && <span className="absolute right-0 w-3 h-3 bg-red rounded-full"></span>}
										<TableIcon
											iconComponent={
												<FingerprintScan
												width={24}
												height={24}
													style={{ color: COLOR.brown }}
												/>
											}
											alt='attendance'
											tooltipId='attendance-tooltip'
											data-tooltip-content='Mark Attendance'
											style={{ backgroundColor: COLOR.brownBg }}
											disabledBtn={!hasAccess(ACCESS.view_attendance)}
											onClick={() => handleOpenFingerPrintModal(employee.full_name)}
											/>
									</div>
								</div>
							</TableCell>
						</TableRow>
					))
				) : (
					<div>
					<TableRow>
						<TableCell
							colSpan={EMPLOYEE_HEAD_DATA.length}
							className='text-center'
							>
							No Employees Found
						</TableCell>
					</TableRow>
				</div>
				)}
			</CustomTable>
			<PaySalaryModal
				open={salaryModal.open}
				onOpenChange={handleSalaryModalChange}
				employee={salaryModal.employee}
				onSubmit={handlePaySalary}
				isSubmitting={isSalarySubmitting}
			/>

			<FingerprintModal
				open={fingerPrintModal.open}
				employeeName={fingerPrintModal.employeeName}
				isRegistered={fingerPrintModal.firstEmployee}
				onClose={handleCloseFingerPrintModal}
				onUpdate={handleUpdateFingerPrint}
			/>

		</Layout>
	);
};

export default Employees;
