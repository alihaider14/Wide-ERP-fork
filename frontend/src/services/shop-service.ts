import {
	TAddAndUpdateShopResponse,
	TGetShopsResponse,
	TShop,
} from "@/types/Shops";
import { axiosInstance } from "./axios-cofig";
import { validateWithZod } from "@/lib/handle-error";
import { addShopSchema, updateShopSchema } from "@/validations/shop.schema";

export const getShopKeys = async (): Promise<
	Pick<TShop, "_id" | "name" | "shopify_store_key" | "shopify_api_key">[]
> => {
	const response = await axiosInstance.get("/shops/keys");
	return response.data.shops;
};

export const getShops = async (
	pageNo: number,
	size: number,
	status?: "active" | "disabled",
	search?: string,
	sortBy?: "name" | "phone" | "createdAt",
	sortOrder?: "asc" | "desc",
): Promise<TGetShopsResponse> => {
	let url = `/shops?pageNo=${pageNo}&size=${size}`;
	if (search) url += `&q=${search}`;
	if (status) url += `&status=${status}`;
	if (sortBy) url += `&sortBy=${sortBy}`;
	if (sortOrder) url += `&sortOrder=${sortOrder}`;

	const response = await axiosInstance.get(url);

	return response.data;
};

export const getShopsIdAndName = async (): Promise<
	{ id: string; name: string }[]
> => {
	const response = await axiosInstance.get("/shops");
	return (response.data.shops || []).map(
		(shop: { _id: string; name: string }) => ({
			id: shop._id,
			name: shop.name,
		}),
	);
};

export const shopById = async (
	id?: string,
): Promise<TAddAndUpdateShopResponse> => {
	const response = await axiosInstance.get(`/shops/${id}`);

	return response.data;
};

export const deleteShop = async (id?: string) => {
	const response = await axiosInstance.delete(`/shops/${id}`);

	return response.data;
};

export const addShop = async (
	data: Partial<TShop>,
): Promise<TAddAndUpdateShopResponse> => {
	const validatedData = await validateWithZod(addShopSchema, data);
	const response = await axiosInstance.post(`/shops`, validatedData);
	return response.data;
};

export const updateShop = async ({
	_id,
	...rest
}: Partial<TShop>): Promise<TAddAndUpdateShopResponse> => {
	const validatedData = await validateWithZod(updateShopSchema, {
		shopId: _id,
		...rest,
	});
	const response = await axiosInstance.put(`/shops`, validatedData);

	return response.data;
};


export const verifyShop = async (data: {
  shopify_store_key: string;
  shopify_api_key: string;
}) => {
  const response = await axiosInstance.post(
    "/verify-shop",
    data
  );

  return response.data;
};
