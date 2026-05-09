import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "./useDebounce";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AttendanceService, EmployeeService } from "@/services";
import {
	formatDateTimeLocalValue,
	formatTimeLocalValue,
	parseDateTimeLocalValue,
	setEndOfDay,
	setStartOfDay,
} from "@/helper/date-format";
import {
	TAttendance,
	TAttendanceErrorResponse,
	TAttendanceSummary,
	TManualAttendance,
	MarkType,
} from "@/types/Attendance";
import { TDateRange } from "@/types/Date";
import { TEmployee } from "@/types/Employee";
import toast from "react-hot-toast";
import { TError } from "@/types/TError";
import { manualAttendanceSchema } from "@/validations/attendance.schema";
import { MARK_OPTIONS } from "@/constant/attendanceData";

const markOptions = MARK_OPTIONS.map((o) => ({ id: o.value, name: o.label }));

const useAttendance = () => {
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const createInitialManualData = (): TManualAttendance => ({
		employee_id: "",
		mark: "",
		attendance_date_time: formatDateTimeLocalValue(),
		note: "",
	});

	const [pageSize, setPageSize] = useState(10);
	const [search, setSearch] = useState("");
	const [pageNo, setPageNo] = useState(1);
	const [dateRange, setDateRange] = useState<TDateRange>(() => {
		const today = new Date();
		return {
			from: setStartOfDay(today),
			to: setEndOfDay(today),
		};
	});

	const [editModal, setEditModal] = useState(false);
	const [manualData, setManualData] = useState<TManualAttendance>(createInitialManualData);
	const [errors, setErrors] = useState<Record<string, string>>({});

	const debounceSearch = useDebounce(search);

	const { data: employeesData } = useQuery({
		queryKey: ["employees", 1, 100, ""],
		queryFn: () => EmployeeService.getEmployees(1, 100),
	});

	const employees = useMemo(
		() =>
			(employeesData?.employees || []).map((emp: TEmployee & { _id: string }) => ({
				id: emp._id,
				name: emp.full_name,
			})),
		[employeesData],
	);

	const attendanceDateTime = useMemo(
		() => parseDateTimeLocalValue(manualData.attendance_date_time),
		[manualData.attendance_date_time],
	);

	const attendanceTimeValue = useMemo(
		() => formatTimeLocalValue(attendanceDateTime || new Date()),
		[attendanceDateTime],
	);

	const { data, isLoading } = useQuery({
		queryKey: ["attendance", pageNo, pageSize, debounceSearch, dateRange],
		queryFn: () =>
			AttendanceService.getAttendance(
				pageNo,
				pageSize,
				debounceSearch,
				dateRange.from,
				dateRange.to,
			),
	});

	const attendanceData: TAttendance[] = data?.attendance ?? [];

	const summary: TAttendanceSummary = useMemo(() => ({
		onTime: data?.on_time ?? 0,
		late: data?.late ?? 0,
		absent: data?.absent ?? 0,
		onLeave: data?.on_leave ?? 0
	}), [data]);

	const remainingText =
		attendanceData.length > 0
			? `${data?.from ?? 1} - ${data?.to ?? attendanceData.length} of ${data?.total_rows ?? attendanceData.length}`
			: "0 - 0 of 0";

	const disabledPagination = {
		next: !attendanceData.length || pageNo >= (data?.total_pages ?? 1),
		prev: !attendanceData.length || pageNo <= 1,
		first: !attendanceData.length || pageNo === 1,
		last: !attendanceData.length || pageNo >= (data?.total_pages ?? 1),
	};

	const handleChangePageSize = (size: number) => {
		setPageSize(size);
		setPageNo(1);
	};

	const handleNextPage = () => {
		if (!data || pageNo >= data.total_pages) return;
		setPageNo((prev) => prev + 1);
	};

	const handlePrevPage = () => {
		if (pageNo <= 1) return;
		setPageNo((prev) => prev - 1);
	};

	const handleLastPage = () => {
		if (!data || pageNo === data.total_pages) return;
		setPageNo(data.total_pages);
	};

	const handleFirstPage = () => {
		if (pageNo === 1) return;
		setPageNo(1);
	};

	const handleDateRangeChange = (range: Partial<TDateRange>) => {
		setDateRange({ from: range.from, to: range.to });
		setPageNo(1);
	};

	const handleOpenMarkAttendance = () => {
		window.open("/mark-attendance", "_blank", "noopener,noreferrer");
	};

	const handleOpenEdit = (record: TAttendance) => {
		const dateTimeStr = record.check_in || record.check_out || `${record.date}T09:00:00`;
		const date = new Date(dateTimeStr);
		setManualData({
			employee_id: record.employee_id,
			mark: "",
			attendance_date_time: formatDateTimeLocalValue(date),
			note: "",
		});
		setErrors({});
		setEditModal(true);
	};

	const handleCloseEdit = () => {
		setEditModal(false);
		setManualData(createInitialManualData());
		setErrors({});
	};

	const handleEmployeeSelect = (id: string) => {
		setManualData((prev) => ({ ...prev, employee_id: id }));
	};

	const handleMarkSelect = (value: MarkType) => {
		setManualData((prev) => ({ ...prev, mark: value }));
	};

	const handleManualChange =
		(field: keyof TManualAttendance) =>
		(e: React.ChangeEvent<HTMLInputElement>) => {
			setManualData((prev) => ({ ...prev, [field]: e.target.value }));
		};

	const handleAttendanceDateTimeChange = (value: string) => {
		setManualData((prev) => ({ ...prev, attendance_date_time: value }));
	};

	const handleAttendanceDateSelect = (date?: Date) => {
		if (!date) return;
		const currentDateTime = attendanceDateTime || new Date();
		const nextDateTime = new Date(
			date.getFullYear(),
			date.getMonth(),
			date.getDate(),
			currentDateTime.getHours(),
			currentDateTime.getMinutes(),
		);
		handleAttendanceDateTimeChange(formatDateTimeLocalValue(nextDateTime));
	};

	const handleAttendanceTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const [hoursValue, minutesValue] = e.target.value.split(":");
		const hours = Number(hoursValue);
		const minutes = Number(minutesValue);
		if (Number.isNaN(hours) || Number.isNaN(minutes)) return;
		const nextDateTime = new Date(attendanceDateTime || new Date());
		nextDateTime.setHours(hours, minutes, 0, 0);
		handleAttendanceDateTimeChange(formatDateTimeLocalValue(nextDateTime));
	};

	const handleEditSubmit = () => {
		const result = manualAttendanceSchema.safeParse(manualData);
		if (!result.success) {
			const fieldErrors: Record<string, string> = {};
			result.error.errors.forEach((error) => {
				if (error.path.length > 0) {
					fieldErrors[String(error.path[0])] = error.message;
				}
			});
			setErrors(fieldErrors);
			return;
		}
		setErrors({});
		const payload: TManualAttendance = {
			...manualData,
			attendance_date_time: new Date(manualData.attendance_date_time).toISOString(),
		};
		editAttendanceMutation.mutate(payload);
	};

	const editAttendanceMutation = useMutation({
		mutationFn: AttendanceService.updateAttendance,
		onSuccess: () => {
			toast.success("Attendance updated successfully.");
			handleCloseEdit();
			queryClient.invalidateQueries({ queryKey: ["attendance"] });
		},
		onError: (error: TError) => {
			const responseData: TAttendanceErrorResponse | undefined = error?.response?.data;
			const firstValidationError = responseData?.errors
				? Object.values(responseData.errors).find(
						(value) => typeof value === "string" && value.trim().length > 0,
				  )
				: undefined;
			const message =
				responseData?.message ||
				(typeof responseData?.error === "string" ? responseData.error : undefined) ||
				firstValidationError ||
				"Failed to update attendance. Please try again.";
			toast.error(message);
		},
	});

	return {
		search,
		isLoading,
		attendanceData,
		pageNo,
		pageSize,
		dateRange,
		summary,
		remainingText,
		disabledPagination,
		navigate,
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
	};
};

export default useAttendance;