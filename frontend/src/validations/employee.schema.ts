import { z } from "zod";
import { ERROR_MESSAGES } from "@/constant/errorMessage";
import { TWorkingHourEntry } from "@/types/Employee";
import { SHORT_MONTH_NAMES } from "@/constant/Date";
import {
	CNIC_REGEX,
	EMPLOYEE_NAME_REGEX,
	PHONE_REGEX,
} from "@/constant/regexValidation";
import { getTimeInMinutes } from "@/helper/time-format";

export const employeeSchema = z.object({
	full_name: z
		.string({ required_error: ERROR_MESSAGES.nameRequired })
		.trim()
		.min(4, { message: ERROR_MESSAGES.name })
		.regex(EMPLOYEE_NAME_REGEX, {
			message: ERROR_MESSAGES.nameInvalid,
		}),

	designation: z
		.string({ required_error: ERROR_MESSAGES.designationRequired })
		.trim()
		.min(1, { message: ERROR_MESSAGES.designationRequired })
		.regex(EMPLOYEE_NAME_REGEX, {
			message: ERROR_MESSAGES.designationInvalid,
		}),

	base_salary: z
		.number({ required_error: "Base salary is required" })
		.min(0, { message: ERROR_MESSAGES.baseSalaryInvalid }),

	phone: z
		.string({ required_error: ERROR_MESSAGES.phone })
		.min(11, { message: ERROR_MESSAGES.phoneLeast })
		.regex(PHONE_REGEX, { message: ERROR_MESSAGES.phoneInvalid }),

	cnic: z
		.string({ required_error: ERROR_MESSAGES.cnicRequired })
		.trim()
		.min(1, { message: ERROR_MESSAGES.cnicRequired })
		.regex(CNIC_REGEX, { message: ERROR_MESSAGES.cnicInvalid }),

	address: z
		.string({ required_error: ERROR_MESSAGES.addressRequired })
		.trim()
		.min(1, { message: ERROR_MESSAGES.addressRequired }),

	joined_at: z
		.string({ required_error: ERROR_MESSAGES.joinedAtRequired })
		.trim()
		.min(1, { message: ERROR_MESSAGES.joinedAtRequired }),

	status: z.enum(["Onboard", "Active", "On hold", "Terminated"], {
		required_error: ERROR_MESSAGES.statusRequired,
	}),
});

export const validateWorkingHours = (
	entries: TWorkingHourEntry[],
): string | null => {
	for (const entry of entries) {
		if (entry.is_working_day && (!entry.start_time || !entry.end_time)) {
			return `${entry.day}: Start Time and End Time are required when day is enabled`;
		}
		if (
			(entry.start_time && !entry.end_time) ||
			(!entry.start_time && entry.end_time)
		) {
			return `${entry.day}: Both Start Time and End Time must be provided together`;
		}
		if (entry.start_time && entry.end_time) {
			const startMinutes = getTimeInMinutes(entry.start_time);
			const endMinutes = getTimeInMinutes(entry.end_time);

			if (startMinutes >= endMinutes) {
				return `${entry.day}: Start Time must be before End Time`;
			}
		}
	}
	return null;
};

const isNotFutureMonth = (value: string) => {
	const parts = value.split(", ");
	if (parts.length !== 2) return false;
	const [monthStr, yearStr] = parts;
	const monthIndex = SHORT_MONTH_NAMES.indexOf(
		monthStr as (typeof SHORT_MONTH_NAMES)[number],
	);
	if (monthIndex === -1) return false;
	const year = parseInt(yearStr, 10);
	if (Number.isNaN(year)) return false;
	const now = new Date();
	const currentYear = now.getFullYear();
	const currentMonth = now.getMonth();
	if (year > currentYear) return false;
	if (year === currentYear && monthIndex > currentMonth) return false;
	return true;
};

export const paySalarySchema = z.object({
	base_salary: z
		.number({
			required_error: "Base salary is required",
			invalid_type_error: "Base salary is required",
		})
		.min(1, { message: "Base salary is required" }),
	commission: z
		.number({ required_error: ERROR_MESSAGES.commissionInvalid })
		.min(0, { message: ERROR_MESSAGES.commissionInvalid }),
	other: z
		.number({ required_error: ERROR_MESSAGES.otherAmountInvalid })
		.min(0, { message: ERROR_MESSAGES.otherAmountInvalid }),
	payment_month: z
		.string({ required_error: ERROR_MESSAGES.paymentMonthRequired })
		.trim()
		.min(1, { message: ERROR_MESSAGES.paymentMonthRequired })
		.refine(isNotFutureMonth, { message: ERROR_MESSAGES.paymentMonthFuture }),
	paid_at: z
		.string({ required_error: ERROR_MESSAGES.paidAtRequired })
		.trim()
		.min(1, { message: ERROR_MESSAGES.paidAtRequired }),
	note: z.string().trim().optional().default(""),
});
