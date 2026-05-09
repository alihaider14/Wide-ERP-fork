export type TAttendance = {
	_id: string;
	employee_id: string;
	name: string;
	check_in: string;
	check_out: string;
	marked_leave_by: string;
	date: string;
	duration_minutes: number;
	overtime_minutes: number;
	marked_by: string;
	status: "on_time" | "late" | "absent" | "on_leave";
};

export type ScanMode = "check_in" | "check_out";

export type MarkType = "check_in" | "check_out" | "absent" | "leave";

export type TManualAttendance = {
	employee_id: string;
	mark: MarkType | "";
	attendance_date_time: string;
	note: string;
};

export type TEmployeeOption = {
	id: string;
	name: string;
};

export type TGetAttendanceResponse = {
	attendance: TAttendance[];
	total_rows: number;
	total_pages: number;
	from: number;
	to: number;
	on_time: number;
	late: number;
	absent: number;
	on_leave: number;
};

export type TAttendanceErrorResponse = {
	message?: string;
	error?: string;
	errors?: Record<string, string>;
};

export type TAttendanceStatus = "on_time" | "late" | "absent" | "on_leave";

export type TAttendanceSummary = {
	onTime: number;
	late: number;
	absent: number;
	onLeave: number;
};