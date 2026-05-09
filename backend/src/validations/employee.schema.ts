import { z } from "zod";
import {
	CNIC_REGEX,
	EMPLOYEE_NAME_REGEX,
	EMPLOYEE_PHONE_REGEX,
	TIME_REGEX,
	VALID_DAYS,
} from "~/constants/employee";
import { ERROR_MESSAGES } from "~/constants/errorMessages";
import { SHORT_MONTH_NAMES } from "~/constants/date";
import { getTimeInMinutes } from "~/helper/time-formator";

const workingHourEntrySchema = z.object({
	day: z.enum(VALID_DAYS),
	is_working_day: z.boolean(),
	start_time: z.string().regex(TIME_REGEX, "Must be HH:mm format").nullable(),
	end_time: z.string().regex(TIME_REGEX, "Must be HH:mm format").nullable(),
}).refine(
	(data) => {
		if (data.start_time !== null || data.end_time !== null) {
			return data.start_time !== null && data.end_time !== null;
		}
		return true;
	},
	{ message: "Both start_time and end_time must be provided together" },
).refine(
	(data) => {
		if (!data.start_time || !data.end_time) {
			return true;
		}

		return getTimeInMinutes(data.start_time) < getTimeInMinutes(data.end_time);
	},
	{ message: "Start time must be before end time" },
);

const workingHoursSchema = z
	.array(workingHourEntrySchema)
	.max(7)
	.refine(
		(entries) => {
			const days = entries.map((e) => e.day);
			return new Set(days).size === days.length;
		},
		{ message: "Duplicate day entries are not allowed" },
	)
	.optional();

const isNotFutureDate = (dateValue: string) => {
	const date = new Date(dateValue);

	if (Number.isNaN(date.getTime())) {
		return false;
	}

	return date.getTime() <= Date.now();
};

const isNotFutureMonth = (value: string) => {
	const parts = value.split(", ");
	if (parts.length !== 2) return false;
	const [monthStr, yearStr] = parts;
	const monthIndex = SHORT_MONTH_NAMES.indexOf(monthStr as (typeof SHORT_MONTH_NAMES)[number]);
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

export const addEmployeeSchema = z.object({
	full_name: z
		.string()
		.trim()
		.min(4, ERROR_MESSAGES.name)
		.regex(EMPLOYEE_NAME_REGEX, ERROR_MESSAGES.nameInvalid),
	designation: z
		.string()
		.trim()
		.min(1, ERROR_MESSAGES.designationRequired)
		.regex(EMPLOYEE_NAME_REGEX, ERROR_MESSAGES.designationInvalid),
	base_salary: z.number().min(0, ERROR_MESSAGES.baseSalaryInvalid),
	phone: z.string().trim().min(11, ERROR_MESSAGES.phoneLeast).regex(EMPLOYEE_PHONE_REGEX, ERROR_MESSAGES.phoneInvalid),
	cnic: z
		.string()
		.trim()
		.min(1, ERROR_MESSAGES.cnicRequired)
		.regex(CNIC_REGEX, ERROR_MESSAGES.cnicInvalid),
	address: z.string().trim().min(1, ERROR_MESSAGES.addressRequired),
	joined_at: z
		.string()
		.trim()
		.min(1, ERROR_MESSAGES.joinedAtRequired),
	status: z.enum(["Onboard", "Active", "On hold", "Terminated"], {
		required_error: ERROR_MESSAGES.statusRequired,
	}),
	working_hours: workingHoursSchema,
});

export const getEmployeesSchema = z.object({
	pageNo: z.string().transform(Number),
	size: z.string().transform(Number),
	q: z.string().optional(),
});

export const getEmployeeSalariesSchema = z.object({
	pageNo: z.string().transform(Number),
	size: z.string().transform(Number),
	from: z.string().optional(),
	to: z.string().optional(),
});

export const updateEmployeeSchema = z.object({
	_id: z.string().trim(),
	full_name: z
		.string()
		.trim()
		.min(4, ERROR_MESSAGES.name)
		.regex(EMPLOYEE_NAME_REGEX, ERROR_MESSAGES.nameInvalid),
	designation: z
		.string()
		.trim()
		.min(1, ERROR_MESSAGES.designationRequired)
		.regex(EMPLOYEE_NAME_REGEX, ERROR_MESSAGES.designationInvalid),
	base_salary: z.number().min(0, ERROR_MESSAGES.baseSalaryInvalid),
	phone: z.string().trim().min(11, ERROR_MESSAGES.phoneLeast).regex(EMPLOYEE_PHONE_REGEX, ERROR_MESSAGES.phoneInvalid),
	cnic: z
		.string()
		.trim()
		.min(1, ERROR_MESSAGES.cnicRequired)
		.regex(CNIC_REGEX, ERROR_MESSAGES.cnicInvalid),
	address: z.string().trim().min(1, ERROR_MESSAGES.addressRequired),
	joined_at: z
		.string()
		.trim()
		.min(1, ERROR_MESSAGES.joinedAtRequired),
	status: z.enum(["Onboard", "Active", "On hold", "Terminated"], {
		required_error: ERROR_MESSAGES.statusRequired,
	}),
	working_hours: workingHoursSchema,
});

export const updateEmployeeStatusSchema = z.object({
	_id: z.string().trim().min(1, ERROR_MESSAGES.employeeNotFound),
	status: z.enum(["Onboard", "Active", "On hold", "Terminated"], {
		required_error: ERROR_MESSAGES.statusRequired,
	}),
});

export const deleteEmployeeSchema = z.object({
	_id: z.string().trim().min(1, ERROR_MESSAGES.employeeNotFound),
});

export const createEmployeeSalarySchema = z.object({
	employee_id: z
		.string()
		.trim()
		.min(1, ERROR_MESSAGES.employeeIdRequired),
	base_salary: z.number().min(0, ERROR_MESSAGES.baseSalaryInvalid),
	commission: z.number().min(0, ERROR_MESSAGES.commissionInvalid),
	other: z.number().min(0, ERROR_MESSAGES.otherAmountInvalid),
	payment_month: z
		.string()
		.trim()
		.min(1, ERROR_MESSAGES.paymentMonthRequired)
		.refine(isNotFutureMonth, ERROR_MESSAGES.paymentMonthFuture),
	paid_at: z
		.string()
		.trim()
		.min(1, ERROR_MESSAGES.paidAtRequired)
		.refine(isNotFutureDate, ERROR_MESSAGES.paidAtFuture),
	note: z.string().trim().optional().default(""),
});

export const updateEmployeeSalarySchema = z.object({
	_id: z.string().trim().min(1, "Salary record ID is required."),
	base_salary: z.number().min(0, ERROR_MESSAGES.baseSalaryInvalid),
	commission: z.number().min(0, ERROR_MESSAGES.commissionInvalid),
	other: z.number().min(0, ERROR_MESSAGES.otherAmountInvalid),
	payment_month: z
		.string()
		.trim()
		.min(1, ERROR_MESSAGES.paymentMonthRequired)
		.refine(isNotFutureMonth, ERROR_MESSAGES.paymentMonthFuture),
	paid_at: z
		.string()
		.trim()
		.min(1, ERROR_MESSAGES.paidAtRequired)
		.refine(isNotFutureDate, ERROR_MESSAGES.paidAtFuture),
	note: z.string().trim().optional().default(""),
});
