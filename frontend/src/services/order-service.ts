import {
  TAddAndUpdateOrderResponse,
  TGetOrderResponse,
  TOrder,
  TOrderByIdResponse,
  TOrderItemByIdResponse,
  TOrderItems,
  TOrderLogsHistoryResponse,
} from '@/types/Order';
import { axiosInstance } from './axios-cofig';
import { validateWithZod } from '@/lib/handle-error';
import { addOrderSchema, updateOrderSchema } from '@/validations/order.schema';

export const getOrders = async (
  pageNo: number,
  size: number,
  search?: string,
  from?: Date,
  to?: Date
): Promise<TGetOrderResponse> => {
  let url = `/orders?pageNo=${pageNo}&size=${size}`;
  if (search) url += `&q=${search}`;
  if (from) url += `&from=${from}`;
  if (to) url += `&to=${to}`;

  const response = await axiosInstance.get(url);

  return response.data;
};

export const updateOrderStatus = async ({
  _id,
  status,
  user_id,
}: Partial<TOrder>): Promise<TAddAndUpdateOrderResponse> => {
  const response = await axiosInstance.patch(`/orders`, {
    order_id: _id,
    status: status,
    user_id,
  });

  return response.data;
};

export const orderById = async (id?: string): Promise<TOrderByIdResponse> => {
  const response = await axiosInstance.get(`/orders/${id}`);

  return response.data;
};

export const getOrderItemsById = async (
  id?: string
): Promise<TOrderItemByIdResponse> => {
  const response = await axiosInstance.get(`/orders-items/${id}`);

  return response.data;
};

export const getOrderLogsHistory = async (
  id?: string
): Promise<TOrderLogsHistoryResponse> => {
  const response = await axiosInstance.get(`/order-logs?order=${id}`);

  return response.data;
};

export const addOrder = async (
  data: Partial<TOrder>
): Promise<TAddAndUpdateOrderResponse> => {
  const validatedData = await validateWithZod(addOrderSchema, {
    ...data,
    items_count: Number(data?.items_count) || 0,
    sub_total_amount: Number(data?.sub_total_amount) || 0,
    recieved_amount: data?.recieved_amount != null 
      ? Number(data?.recieved_amount) 
      : undefined,
    total_amount: Number(data?.total_amount) || 0,
    discount: String(data.sub_total_amount! - Number(data.total_amount)),
    items: data?.items?.map((item: TOrderItems) => ({
      product_id: item?.product_id,
      price: Number(item.price),
      quantity: Number(item.quantity),
      original_price: Number(item.original_price),
    })),
  });
  const response = await axiosInstance.post(`/orders`, validatedData);
  return response.data;
};

export const updateOrder = async ({
  _id,
  customer_name,
  customer_phone,
  sub_total_amount,
  total_amount,
  items_count,
  items,
  status,
  user_id,
  recieved_amount
}: Partial<TOrder>): Promise<TAddAndUpdateOrderResponse> => {
  const validatedData = await validateWithZod(updateOrderSchema, {
    order_id: _id,
    customer_name,
    customer_phone,
    discount: String(sub_total_amount! - Number(total_amount)),
    recieved_amount: Number(recieved_amount),
    items_count: Number(items_count),
    sub_total_amount: Number(sub_total_amount),
    total_amount: Number(total_amount),
    items: items?.map((item: TOrderItems) => ({
      product_id: item?.product_id,
      price: Number(item.price),
      quantity: Number(item.quantity),
      original_price: Number(item.original_price),
    })),
    status,
    user_id,
  });
  const response = await axiosInstance.put(`/orders`, validatedData);

  return response.data;
};
