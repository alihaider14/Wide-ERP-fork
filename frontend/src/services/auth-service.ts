import { TResetPassword, TUser, TSignInResponse } from "@/types/User";
import { axiosInstance } from "./axios-cofig";
import { validateWithZod } from "@/lib/handle-error";
import {
  forgetPasswordSchema,
  resetPasswordSchema,
  signInSchema,
} from "@/validations/auth.schema";

export const signIn = async ({
  email,
  password,
}: Partial<TUser>): Promise<TSignInResponse> => {
  const validatedAuth = await validateWithZod(signInSchema, {
    email,
    password,
  });
  const response = await axiosInstance.post("/sign-in", validatedAuth);

  return response.data;
};

export const forgetPassword = async (email: string) => {
  const validatedAuth = await validateWithZod(forgetPasswordSchema, { email });
  const response = await axiosInstance.post("/forgot-password", validatedAuth);
  return response.data;
};

export const resetPassword = async ({
  token,
  newPassword,
  confirmPassword,
}: Partial<TResetPassword>) => {
  const validatedAuth = await validateWithZod(resetPasswordSchema, {
    token,
    newPassword,
    confirmPassword,
  });
  const response = await axiosInstance.post("/reset-password", validatedAuth);
  return response.data;
};
