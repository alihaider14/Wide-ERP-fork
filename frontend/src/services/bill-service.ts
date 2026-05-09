import {
  BillCreateInput,
  BillDetails,
  BillListItem,
} from "@/types/bill";
import axios from "axios";
import { axiosInstance } from "./axios-cofig";
export const getBills = async (
  pageNo: number,
  size: number,
  search?: string,
  startDate?: string,
  endDate?: string,
): Promise<{
  bills: BillListItem[];
  total_pages: number;
  total_rows: number;
  from: number;
  to: number;
}> => {
  let url = `/bills?pageNo=${pageNo}&size=${size}`;
  if (search) url += `&q=${search}`;
  if (startDate) url += `&start_date=${startDate}`;
  if (endDate) url += `&end_date=${endDate}`;
  const response = await axiosInstance.get(url);
  return response.data;
};

export const getBillById = async (id: string): Promise<BillDetails> => {
  const response = await axiosInstance.get(`/bill/${id}`);
  return response.data;
};

export const createBill = async (
  data: BillCreateInput,
): Promise<BillListItem> => {
  const response = await axiosInstance.post(`/bill`, data);
  return response.data;
};

export const updateBill = async (
  data: Partial<BillDetails>,
): Promise<BillListItem> => {

  try {
    const response = await axiosInstance.put(`/bill`, data);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data?.error || "Failed to update bill";
    }

    throw error;
  }
};

export const deleteBill = async (id: string): Promise<{message: string}> => {
  const response = await axiosInstance.delete(`/bill/${id}`);
  return response.data;
};
