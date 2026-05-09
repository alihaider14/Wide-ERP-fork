import { z } from "zod";
import { ERROR_MESSAGES } from "~/constants/errorMessages";

export const signUpSchema = z.object({
    full_name: z.string().trim().min(4, ERROR_MESSAGES.name),
    email: z.string().trim().email(ERROR_MESSAGES.email),
    password: z.string().min(8, ERROR_MESSAGES.password),
});

export const signInSchema = z.object({
    email: z.string().trim().email(ERROR_MESSAGES.email),
    password: z.string().min(8, ERROR_MESSAGES.password),
});

export const forgotPasswordSchema = z.object({
    email: z.string().trim().email(ERROR_MESSAGES.email),
});

export const resetPasswordSchema = z.object({
    token: z.string(),
    newPassword: z.string().min(8, ERROR_MESSAGES.password),
    confirmPassword: z.string().min(8, ERROR_MESSAGES.password),
});
