import { Edit } from "@/assets/svg";
import { CustomTable, Layout, TableIcon, TableRowLoader } from "@/components";
import { TableCell, TableRow } from "@/components/ui/table";
import { ATTENDANCE_HEAD_DATA } from "@/constant/tableData";
import { DateRangePicker } from "@/components/custom/DatePickerRange";
import useAttendance from "@/hooks/useAttendance";
import { TAttendance, TAttendanceStatus } from "@/types/Attendance";
import { formatDateOnly, formatCheckInOut, formatDuration } from "@/helper/time-formator";
import ManualAttendanceModal from "@/components/custom/ManualAttendanceModal";

const STATUS_CONFIG: Record<TAttendanceStatus, { label: string; className: string }> = {
	on_time: { label: "On Time", className: "border border-green text-green bg-green-50" },
	late:    { label: "Late",    className: "border border-green text-green bg-orange-50" },
	absent:  { label: "Absent",  className: "border border-green text-green bg-red-50" },
	on_leave:{ label: "On Leave",className: "border border-primaryDarkBlue text-primaryDarkBlue bg-blue-50" },
};

const StatusBadge = ({ status }: { status?: TAttendanceStatus }) => {
	if (!status || !STATUS_CONFIG[status]) return <span className="text-gray-400">-</span>;
	const { label, className } = STATUS_CONFIG[status];
	return (
		<span className={`inline-flex items-center justify-center min-w-25 py-1 rounded text-xs font-medium whitespace-nowrap ${className}`}>
			{label}
		</span>
	);
};

const Attendance = () => {
	const {
		search,
		isLoading,
		attendanceData,
		pageSize,
		dateRange,
		summary,
		remainingText,
		disabledPagination,
		setSearch,
		handleDateRangeChange,
		handleNextPage,
		handlePrevPage,
		handleLastPage,
		handleChangePageSize,
		handleFirstPage,
		handleOpenMarkAttendance,
		editModal,
		manualData,
		employees,
		markOptions,
		attendanceDateTime,
		attendanceTimeValue,
		errors,
		handleOpenEdit,
		handleCloseEdit,
		handleEmployeeSelect,
		handleMarkSelect,
		handleManualChange,
		handleAttendanceDateSelect,
		handleAttendanceTimeChange,
		handleEditSubmit,
	} = useAttendance();

	return (
		<Layout headerTitle="Attendance" buttonLabel="Attendance">
			<CustomTable
				searchValue={search}
				searchPlaceholder="Search"
				onChangeSearch={(e) => setSearch(e.target.value)}
				buttonLabel="Mark Attendance"
				onClickButton={handleOpenMarkAttendance}
				searchRightComponent={
					<DateRangePicker
						initialValue={dateRange}
						onDateRangeChange={handleDateRangeChange}
						className="min-w-[251px] h-9 rounded-[3px] border py-1.5 px-4 gap-3 w-full opacity-100 flex-nowrap whitespace-nowrap 2xl:px-2 2xl:gap-1 2xl:max-w-[251px]"
					/>
				}
				head={ATTENDANCE_HEAD_DATA}
				headerRowHeight="50px"
				bodyRowHeight="50px"
				bodyCellPaddingY="0px"
				isPaginationText={
					<>
						<span className="font-normal text-foreground text-sm tracking-[0.02em]">
							On Time: <span className="font-semibold">{summary.onTime}</span>
						</span>
						<span className="font-normal text-foreground text-sm tracking-[0.02em]">
							Late: <span className="font-semibold">{summary.late}</span>
						</span>
						<span className="font-normal text-foreground text-sm tracking-[0.02em]">
							Absent: <span className="font-semibold">{summary.absent}</span>
						</span>
						<span className="font-normal text-foreground text-sm tracking-[0.02em]">
							On Leave: <span className="font-semibold">{summary.onLeave}</span>
						</span>
					</>
				}
				remaining={remainingText}
				handleChangePageSize={handleChangePageSize}
				handleFirstPage={handleFirstPage}
				handleLastPage={handleLastPage}
				handleNextPage={handleNextPage}
				handlePrevPage={handlePrevPage}
				pageSize={pageSize}
				disabledPagination={disabledPagination}
			>
				{isLoading ? (
					<TableRowLoader rowsNum={10} cellsNum={ATTENDANCE_HEAD_DATA.length} />
				) : attendanceData.length > 0 ? (
					attendanceData.map((record: TAttendance, index: number) => (
						<TableRow key={record._id || index} className="group">
							<TableCell className="font-medium leading-[100%] pl-7">
								{record.name || "N/A"}
							</TableCell>
							<TableCell className="leading-[100%] whitespace-nowrap">
								{formatDateOnly(record.check_in || record.check_out)}
							</TableCell>
							<TableCell className="leading-[100%] whitespace-nowrap">
								{formatCheckInOut(record.check_in, record.check_out)}
							</TableCell>
							<TableCell className="leading-[100%] whitespace-nowrap">
								{formatDuration(record.duration_minutes)}
							</TableCell>
							<TableCell className="leading-[100%] whitespace-nowrap">
								{formatDuration(record.overtime_minutes)}
							</TableCell>
							<TableCell className="leading-[100%]">
								{record.marked_by || "-"}
							</TableCell>
							<TableCell>
								<StatusBadge status={record.status} />
							</TableCell>
							<TableCell>
								<div className="flex items-center justify-center">
									<TableIcon
										src={Edit}
										alt="edit"
										tooltipId="edit-tooltip"
										data-tooltip-content="Edit"
										className="bg-grey-100"
										onClick={() => handleOpenEdit(record)}
									/>
								</div>
							</TableCell>
						</TableRow>
					))
				) : (
					<TableRow>
						<TableCell colSpan={ATTENDANCE_HEAD_DATA.length} className="text-center">
							No Attendance Records Found
						</TableCell>
					</TableRow>
				)}
			</CustomTable>

		<ManualAttendanceModal
			open={editModal}
			manualData={manualData}
			employees={employees}
			markOptions={markOptions}
			attendanceDateTime={attendanceDateTime}
			attendanceTimeValue={attendanceTimeValue}
			errors={errors}
			onClose={handleCloseEdit}
			onEmployeeSelect={handleEmployeeSelect}
			onMarkSelect={handleMarkSelect}
			onChange={handleManualChange}
			onAttendanceDateSelect={handleAttendanceDateSelect}
			onAttendanceTimeChange={handleAttendanceTimeChange}
			onSubmit={handleEditSubmit}
		/>
		</Layout>
	);
};

export default Attendance;