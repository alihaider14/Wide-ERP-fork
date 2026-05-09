import { TDayName, TEmployeeStatus, TWorkingHourEntry } from "@/types/Employee";

export const EMPLOYEE_STATUSES: TEmployeeStatus[] = [
	"Onboard",
	"Active",
	"On hold",
	"Terminated",
];

export const DEFAULT_WORKING_HOURS: TWorkingHourEntry[] = [
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
	"Sunday",
].map((day) => ({
	day: day as TDayName,
	is_working_day: false,
	start_time: null,
	end_time: null,
}));
