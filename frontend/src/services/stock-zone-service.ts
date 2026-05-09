import { axiosInstance } from './axios-cofig';
import { TStockZone } from '../types/TStockZone';

export const addStockZone = async (data: Partial<TStockZone>) => {
  const response = await axiosInstance.post('/stock-zones', data);
  return response.data;
};

export const getStockZones = async (page: number, size: number, search: string) => {
  const response = await axiosInstance.get('/stock-zones', {
    params: { page, size, search },
  });
  return response.data;
};

export const getStockZoneById = async (id: string) => {
  const response = await axiosInstance.get(`/stock-zones/${id}`);
  return response.data;
};

export const updateStockZone = async (id: string, data: Partial<TStockZone>) => {
  const response = await axiosInstance.put(`/stock-zones`, { ...data, id });
  return response.data;
};

export const deleteStockZone = async (_id: string) => {
  const response = await axiosInstance.delete(`/stock-zones`, { data: { _id } });
  return response.data;
};
