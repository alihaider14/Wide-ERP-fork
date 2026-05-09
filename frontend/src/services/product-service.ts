import {
	TAddAndUpdateProductResponse,
	TGetProductResponse,
	TProduct,
} from "@/types/Products";
import { axiosInstance } from "./axios-cofig";
import { validateWithZod } from "@/lib/handle-error";
import {
	addProductSchema,
	updateProductSchema,
	importProductsSchema,
	syncShopifyProductsSchema,
} from "@/validations/product.schema";
import { resizeImageWithImageCompression } from "@/helper/resizeImage";

export const getProducts = async (
	pageNo: number,
	size: number,
	status: "deleted" | "active",
	filter?: "sold_out" | "low_stock",
	search?: string,
	sortBy?: "sku" | "price" | "qty",
	sortOrder?: "asc" | "desc",
): Promise<TGetProductResponse> => {
	let url = `/products?pageNo=${pageNo}&size=${size}`;
	if (search) url += `&q=${search}`;
	if (status) url += `&status=${status}`;
	if (filter) url += `&filter=${filter}`;
	if (sortBy) url += `&sortBy=${sortBy}`;
	if (sortOrder) url += `&sortOrder=${sortOrder}`;

	const response = await axiosInstance.get(url);

	return response.data;
};

export const productById = async (
	id?: string,
): Promise<TAddAndUpdateProductResponse> => {
	const response = await axiosInstance.get(`/products/${id}`);

	return response.data;
};

export const deleteProduct = async (id?: string) => {
	const response = await axiosInstance.delete(`/products/${id}`);

	return response.data;
};

export const addProduct = async (
	data: Partial<TProduct>,
): Promise<TAddAndUpdateProductResponse> => {
	const { name, barcode, sku, price, low_stock_indicator, image } =
		await validateWithZod(addProductSchema, data);

	const formData = new FormData();

	if (name) formData.append("name", name);
	formData.append("barcode", barcode);
	formData.append("sku", sku);
	formData.append("price", String(price));
	if (low_stock_indicator)
		formData.append("low_stock_indicator", String(low_stock_indicator));

	if (image instanceof File) {
		const resizedImage = await resizeImageWithImageCompression(image);
		formData.append("image", resizedImage);
	}

	const response = await axiosInstance.post(`/products`, formData);

	return response.data;
};

export const updateProduct = async (
	data: Partial<TProduct>,
): Promise<TAddAndUpdateProductResponse> => {
	const { name, barcode, productId, price, low_stock_indicator, image } =
		await validateWithZod(updateProductSchema, {
			...data,
			productId: data._id,
		});

	const formData = new FormData();

	if (name) formData.append("name", name);
	formData.append("barcode", barcode);
	formData.append("productId", productId);
	formData.append("price", String(price));
	if (low_stock_indicator)
		formData.append("low_stock_indicator", String(low_stock_indicator));
	if (image instanceof File) {
		const resizedImage = await resizeImageWithImageCompression(image);
		formData.append("image", resizedImage);
	}

	const response = await axiosInstance.put(`/products`, formData);

	return response.data;
};

export const importProducts = async (products: Partial<TProduct>[]) => {
	const validatedData = await validateWithZod(importProductsSchema, products);

	const response = await axiosInstance.post(`/import-products`, validatedData);

	return response.data;
};

export const syncShopify = async (data: { shopId: string }) => {
	const validatedData = await validateWithZod(syncShopifyProductsSchema, data);
	const response = await axiosInstance.post("/sync-shopify", validatedData);
	return response.data;
};
