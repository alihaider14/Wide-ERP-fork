import { MarkType } from "@/types/Attendance";

export const MARK_OPTIONS: { label: string; value: MarkType }[] = [
	{ label: "Check In", value: "check_in" },
	{ label: "Check Out", value: "check_out" },
	{ label: "Absent", value: "absent" },
	{ label: "Leave", value: "leave" },
];
