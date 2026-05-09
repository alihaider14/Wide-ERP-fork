import { TAddAndUpdateUserResponse, TVendor } from '@/types/Vendor';
import { axiosInstance } from './axios-cofig';

export const getVendors = async (
  pageNo: number,
  size: number,
  search?: string
) => {
  let url = `/vendors?pageNo=${pageNo}&size=${size}`;
  if (search) url += `&q=${search}`;
  const response = await axiosInstance.get(url);

  return response.data;
};

export const vendorById = async (
  id?: string
): Promise<TAddAndUpdateUserResponse> => {
  const response = await axiosInstance.get(`/vendor/${id}`);
  return response.data;
};

export const deleteVendor = async (id?: string) => {
  const response = await axiosInstance.delete(`/vendor/${id}`);
  return response.data;
};

export const addVendor = async ({
  email,
  full_name,
  phone,
  address,
  opening_balance,
}: Partial<TVendor>): Promise<TAddAndUpdateUserResponse> => {
  const response = await axiosInstance.post(`/vendor`, {
    email,
    full_name,
    phone,
    address,
    opening_balance:
      opening_balance !== undefined && opening_balance !== null
        ? Number(opening_balance)
        : 0,
  });
  return response.data;
};

export const updateVendor = async ({
  _id,
  email,
  full_name,
  phone,
  address,
  opening_balance,
}: Partial<TVendor & { _id: string }>): Promise<TAddAndUpdateUserResponse> => {
  const response = await axiosInstance.put(`/vendor`, {
    _id,
    email,
    full_name,
    phone,
    address,
    opening_balance:
      opening_balance !== undefined && opening_balance !== null
        ? Number(opening_balance)
        : 0,
  });
  return response.data;
};
