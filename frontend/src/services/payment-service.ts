import { PaymentListItem } from "@/types/payment";
import { axiosInstance } from "./axios-cofig";

export const getPayments = async (
  pageNo: number,
  size: number,
  search?: string,
  startDate?: string,
  endDate?: string,
): Promise<{
  payments: PaymentListItem[];
  total_pages: number;
  total_rows: number;
  from: number;
  to: number;
}> => {
  let url = `/payments?pageNo=${pageNo}&size=${size}`;
  if (search) url += `&q=${search}`;
  if (startDate) url += `&start_date=${startDate}`;
  if (endDate) url += `&end_date=${endDate}`;
  const response = await axiosInstance.get(url);
  return response.data;
};

export const createPayment = async (data: {
  vendor_id: string;
  paid_amount: number;
  paid_at: string;
  note?: string;
}) => {
  const response = await axiosInstance.post(`/payment`, data);
  return response.data;
};

export const updatePayment = async (data: {
  _id: string;
  vendor_id: string;
  paid_amount: number;
  paid_at: string;
  note?: string;
}) => {
  const response = await axiosInstance.put(`/payment`, data);
  return response.data;
};

export const deletePayment = async (id: string): Promise<{ message: string }> => {
  const response = await axiosInstance.delete(`/payment/${id}`);
  return response.data;
};
