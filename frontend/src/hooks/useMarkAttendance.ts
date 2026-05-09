import { useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
	ScanMode,
	TAttendanceErrorResponse,
	TManualAttendance,
	MarkType,
} from "@/types/Attendance";
import { AttendanceService, EmployeeService } from "@/services";
import { TEmployee } from "@/types/Employee";
import toast from "react-hot-toast";
import { TError } from "@/types/TError";
import {
	formatDateTimeLocalValue,
	formatTimeLocalValue,
	parseDateTimeLocalValue,
} from "@/helper/date-format";
import { manualAttendanceSchema } from "@/validations/attendance.schema";
import { MARK_OPTIONS } from "@/constant/attendanceData";

const markOptions = MARK_OPTIONS.map((o) => ({ id: o.value, name: o.label }));

const useMarkAttendance = () => {

	const [scanModal, setScanModal] = useState<{ open: boolean; mode: ScanMode }>(
		{
			open: false,
			mode: "check_in",
		},
	);

	const [manualModal, setManualModal] = useState(false);
	const [errors, setErrors] = useState<Record<string, string>>({});

	const createInitialManualData = (): TManualAttendance => ({
		employee_id: "",
		mark: "",
		attendance_date_time: formatDateTimeLocalValue(),
		note: "",
	});

	const [manualData, setManualData] = useState<TManualAttendance>(
		createInitialManualData,
	);


	const { data: employeesData } = useQuery({
		queryKey: ["employees", 1, 100, ""],
		queryFn: () => EmployeeService.getEmployees(1, 100),
	});

	const employees = useMemo(
		() =>
			(employeesData?.employees || []).map(
				(emp: TEmployee & { _id: string }) => ({
					id: emp._id,
					name: emp.full_name,
				}),
			),
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

	const handleOpenScan = (mode: ScanMode) => {
		setScanModal({ open: true, mode });
	};

	const handleCloseScan = () => {
		setScanModal((prev) => ({ ...prev, open: false }));
	};

	const handleOpenManual = () => {
		setManualData(createInitialManualData());
		setManualModal(true);
	};

	const handleCloseManual = () => {
		setManualModal(false);
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
		if (!date) {
			return;
		}

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

	const handleAttendanceTimeChange = (
		e: React.ChangeEvent<HTMLInputElement>,
	) => {
		const [hoursValue, minutesValue] = e.target.value.split(":");
		const hours = Number(hoursValue);
		const minutes = Number(minutesValue);

		if (Number.isNaN(hours) || Number.isNaN(minutes)) {
			return;
		}

		const nextDateTime = new Date(attendanceDateTime || new Date());
		nextDateTime.setHours(hours, minutes, 0, 0);

		handleAttendanceDateTimeChange(formatDateTimeLocalValue(nextDateTime));
	};

	const handleManualSubmit = () => {
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

		const parsedDate = new Date(manualData.attendance_date_time);

		const payload: TManualAttendance = {
			...manualData,
			attendance_date_time: parsedDate.toISOString(),
		};

		markAttendanceMutation.mutate(payload);
	};

	const markAttendanceMutation = useMutation({
		mutationFn: AttendanceService.manualAttendance,
		onSuccess: handleMarkAttendanceSuccess,
		onError: handleMarkAttendanceError,
	});

	function handleMarkAttendanceSuccess() {
		toast.success("Attendance marked successfully.");
		handleCloseManual();
	}

	function handleMarkAttendanceError(error: TError) {
		const responseData: TAttendanceErrorResponse | undefined =
			error?.response?.data;

		const firstValidationError = responseData?.errors
			? Object.values(responseData.errors).find(
					(value) => typeof value === "string" && value.trim().length > 0,
			  )
			: undefined;

		const message =
			responseData?.message ||
			(typeof responseData?.error === "string" ? responseData.error : undefined) ||
			firstValidationError ||
			"Failed to mark attendance. Please try again.";

		toast.error(message);
	}

	return {
		scanModal,
		manualModal,
		manualData,
		employees,
		attendanceDateTime,
		attendanceTimeValue,
		errors,
		handleOpenScan,
		handleCloseScan,
		handleOpenManual,
		handleCloseManual,
		handleEmployeeSelect,
		handleMarkSelect,
		handleManualChange,
		handleAttendanceDateSelect,
		handleAttendanceTimeChange,
		handleManualSubmit,
		markOptions,
	};
};

export default useMarkAttendance;
