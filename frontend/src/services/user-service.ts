import {
	TAddAndUpdateUserResponse,
	TGetUserResponse,
	TUser,
} from "@/types/User";
import { axiosInstance } from "./axios-cofig";
import { validateWithZod } from "@/lib/handle-error";
import { addUserSchema, updateUserAccessSchema, updateUserSchema } from "@/validations/user.schema";

export const getUsers = async (
	pageNo: number,
	size: number,
	search?: string,
): Promise<TGetUserResponse> => {
	let url = `/users?pageNo=${pageNo}&size=${size}`;
	if (search) url += `&q=${search}`;
	const response = await axiosInstance.get(url);

	return response.data;
};

export const userById = async (
	id?: string,
): Promise<TAddAndUpdateUserResponse> => {
	const response = await axiosInstance.get(`/users/${id}`);

	return response.data;
};

export const deleteUser = async (id?: string) => {
	const response = await axiosInstance.delete(`/users/${id}`);

	return response.data;
};

export const addUser = async ({
	access,
	designation,
	email,
	full_name,
	phone,
	password,
}: Partial<TUser>): Promise<TAddAndUpdateUserResponse> => {
	const validatedData = await validateWithZod(addUserSchema, {
		access,
		designation,
		email,
		full_name,
		phone,
		password,
	})
	const response = await axiosInstance.post(`/users`, validatedData);

	return response.data;
};

export const updateUser = async ({
	_id,
	designation,
	email,
	full_name,
	phone,
	password,
}: Partial<TUser>): Promise<TAddAndUpdateUserResponse> => {
	const validatedData = await validateWithZod(updateUserSchema, {
	_id,
	designation,
	email,
	full_name,
	phone,
	password,
	})
	const response = await axiosInstance.put(`/users`,  validatedData);

	return response.data;
};

export const updateUserAccess = async ({
  _id,
  access,
}: Partial<TUser>): Promise<TAddAndUpdateUserResponse> => {
  const validatedData = await validateWithZod(updateUserAccessSchema, {_id, access});
  const response = await axiosInstance.put(`/users-access`, validatedData);
  return response.data;
};
