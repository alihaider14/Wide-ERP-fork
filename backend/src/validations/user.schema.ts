import { z } from "zod";
import { PHONE_REGEX } from "~/constants/employee";
import { ERROR_MESSAGES } from "~/constants/errorMessages";

export const addUserSchema = z.object({
	full_name: z.string().trim().min(4, ERROR_MESSAGES.name),
	email: z.string().trim().email(ERROR_MESSAGES.email),
	password: z.string().min(8, ERROR_MESSAGES.password),
	phone: z
		.string()
		.min(11, ERROR_MESSAGES.phoneLeast)
		.regex(PHONE_REGEX, ERROR_MESSAGES.phoneInvalid),
	designation: z.string().trim(),
	access: z.array(z.string().trim()).min(1, ERROR_MESSAGES?.leastAccess),
});

export const updateUserSchema = z.object({
	_id: z.string().trim(),
	full_name: z.string().trim().min(4, ERROR_MESSAGES.name),
	email: z.string().trim().email(ERROR_MESSAGES.email),
	password: z.string().trim().min(8, ERROR_MESSAGES.password).or(z.literal("")),
	phone: z
		.string()
		.min(11, ERROR_MESSAGES.phoneLeast)
		.regex(PHONE_REGEX, ERROR_MESSAGES.phoneInvalid),
	designation: z.string().trim(),
});

export const updateUserAccessSchema = z.object({
	_id: z.string().trim(),
	access: z.array(z.string().trim()).min(1, ERROR_MESSAGES?.leastAccess),
});

export const getUsersSchema = z.object({
	pageNo: z.string().transform(Number),
	size: z.string().transform(Number),
	q: z.string().optional(),
});
