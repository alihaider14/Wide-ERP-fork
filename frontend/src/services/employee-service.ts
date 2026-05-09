import { axiosInstance } from "./axios-cofig";
import {
	TCreateEmployeeSalaryData,
	TUpdateEmployeeSalaryData,
	TEmployee,
	TEmployeeStatus,
} from "@/types/Employee";

export const getEmployees = async (pageNo = 1, pageSize = 10, search = "") => {
	let url = `/employees?pageNo=${pageNo}&size=${pageSize}`;
	if (search) url += `&q=${search}`;
	const response = await axiosInstance.get(url);
	return response.data;
};

export const getEmployeeById = async (id: string) => {
	const response = await axiosInstance.get(`/employees/${id}`);
	return response.data;
};

export const addEmployee = async (data: Partial<TEmployee>) => {
	const response = await axiosInstance.post("/employees", data);
	return response.data;
};

export const updateEmployee = async (data: Partial<TEmployee> & { _id: string }) => {
	const response = await axiosInstance.put("/employees", data);
	return response.data;
};

export const updateEmployeeStatus = async (data: {
	_id: string;
	status: TEmployeeStatus;
}) => {
	const response = await axiosInstance.patch("/employee", data);
	return response.data;
};

export const createEmployeeSalary = async (data: TCreateEmployeeSalaryData) => {
	const response = await axiosInstance.post("/employee-salary", data);
	return response.data;
};

export const updateEmployeeSalary = async (data: TUpdateEmployeeSalaryData) => {
	const response = await axiosInstance.put("/employee-salary", data);
	return response.data;
};

export const deleteEmployee = async (_id: string) => {
	const response = await axiosInstance.delete("/employees", {
		data: { _id },
	});
	return response.data;
};

export const getEmployeeSalaryHistory = async (
	id: string,
	pageNo = 1,
	pageSize = 10,
	from = "",
	to = "",
) => {
	let url = `/employees/${id}/salaries?pageNo=${pageNo}&size=${pageSize}`;
	if (from) url += `&from=${from}`;
	if (to) url += `&to=${to}`;
	const response = await axiosInstance.get(url);
	return response.data;
};

