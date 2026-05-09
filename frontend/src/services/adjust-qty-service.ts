import {
	TAddAndUpdateAdjustQtyResponse,
	TGetAdjustQtyResponse,
	TAdjustQty,
	TProductQtyByIdResponse,
	TImportAdjustQuantites,
	TAdjustmentHistoryResponse,
} from "@/types/AdjustQty";
import { axiosInstance } from "./axios-cofig";
import { validateWithZod } from "@/lib/handle-error";
import {
	createAdjustQtySchema,
	importAdjustQuantitiesSchema,
	updateAdjustQtySchema,
} from "@/validations/productQuantity.schema";

export const getProductQuantities = async (
	pageNo: number,
	size: number,
	productId: string,
	search?: string,
	from?: Date,
	to?: Date,
): Promise<TGetAdjustQtyResponse> => {
	let url = `/adjust-quantity?product_id=${productId}&pageNo=${pageNo}&size=${size}`;
	if (search) url += `&q=${search}`;
	if (from) url += `&from=${from}`;
	if (to) url += `&to=${to}`;

	const response = await axiosInstance.get(url);

	return response.data;
};

export const adjustQtyById = async (
	id?: string,
): Promise<TProductQtyByIdResponse> => {
	const response = await axiosInstance.get(`/adjust-quantity/${id}`);

	return response.data;
};

export const adjustmentHistory = async (
	adjustment_id?: string,
): Promise<TAdjustmentHistoryResponse> => {
	const response = await axiosInstance.get(
		`/adjustment-histories?adjustment_id=${adjustment_id}`,
	);

	return response.data;
};

export const addAdjustQty = async (
	data: Partial<TAdjustQty>,
): Promise<TAddAndUpdateAdjustQtyResponse> => {
	const validatedData = await validateWithZod(createAdjustQtySchema, data);
	const response = await axiosInstance.post(`/adjust-quantity`, validatedData);

	return response.data;
};

export const updateAdjustQty = async ({
	product_id,
	_id,
	reason,
}: Partial<TAdjustQty>): Promise<TAddAndUpdateAdjustQtyResponse> => {
	const validatedData = await validateWithZod(updateAdjustQtySchema, {
		product_id,
		reason,
		productQtyId: _id,
	});
	const response = await axiosInstance.put(`/adjust-quantity`, validatedData);

	return response.data;
};

export const importProductsQuantities = async (
	data: TImportAdjustQuantites[],
) => {
	const validatedData = await validateWithZod(
		importAdjustQuantitiesSchema,
		data,
	);

	const response = await axiosInstance.post(
		`/import-products-quantities`,
		validatedData,
	);

	return response.data;
};
