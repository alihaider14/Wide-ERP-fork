import { ERROR_MESSAGES } from "@/constant/errorMessage";
import { z } from "zod";

export const signUpSchema = z.object({
    full_name: z.string().trim().min(4, {message: ERROR_MESSAGES.name}),
    email: z.string().trim().email({ message: ERROR_MESSAGES.email}),
    password: z.string().min(8, {message : ERROR_MESSAGES.password}),
});


export const signInSchema = z.object({
    email: z.string().trim().email({message : ERROR_MESSAGES.email}),
    password: z.string().min(8, {message: ERROR_MESSAGES.password}),
});

export const forgetPasswordSchema = z.object({
    email: z.string().trim().email({message : ERROR_MESSAGES.email}),
});

export const resetPasswordSchema = z.object({
    token: z.string().trim(),
    newPassword: z.string().min(8, {message: ERROR_MESSAGES.password}),
    confirmPassword: z.string().min(8, {message: ERROR_MESSAGES.password}),
});

