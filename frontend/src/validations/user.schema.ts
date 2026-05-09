import { ERROR_MESSAGES } from "@/constant/errorMessage";
import { PHONE_REGEX } from "@/constant/regexValidation";
import { z } from "zod";

export const addUserSchema = z.object({
	full_name: z.string({required_error: ERROR_MESSAGES.nameRequired}).trim().min(4, {message: ERROR_MESSAGES.name}),
	email: z.string({required_error: ERROR_MESSAGES.emailRequired}).trim().email({message: ERROR_MESSAGES.email}),
	phone: z.string({required_error: ERROR_MESSAGES.phone}).min(11, ERROR_MESSAGES.phoneLeast).regex(PHONE_REGEX, ERROR_MESSAGES.phoneInvalid),
	password: z.string({required_error: ERROR_MESSAGES.passwordRequired}).min(8, {message : ERROR_MESSAGES.password}),
	designation: z.string({required_error: ERROR_MESSAGES.designationRequired}).trim().min(1, {message: ERROR_MESSAGES.designationRequired}),
	access: z.array(z.string().trim()).min(1, {message: ERROR_MESSAGES.leastAccess})
  });
  

  export const updateUserSchema = z.object({
	_id: z.string().trim(),
	full_name: z.string({required_error: ERROR_MESSAGES.nameRequired}).trim().min(4, {message: ERROR_MESSAGES.name}),
	email: z.string({required_error: ERROR_MESSAGES.emailRequired}).trim().email({message: ERROR_MESSAGES.email}),
	phone: z.string({required_error: ERROR_MESSAGES.phone}).min(11, ERROR_MESSAGES.phoneLeast).regex(PHONE_REGEX, ERROR_MESSAGES.phoneInvalid),
	password: z.string().trim().min(8, {message: ERROR_MESSAGES.password}).or(z.literal("")),
	designation: z.string({required_error: ERROR_MESSAGES.designationRequired}).trim().min(1, {message: ERROR_MESSAGES.designationRequired}),
  });
  
	export const updateUserAccessSchema = z.object({
	_id: z.string().trim(),
	access: z.array(z.string().trim()).min(1, { message: ERROR_MESSAGES.leastAccess })
  });