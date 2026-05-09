import { TReduceQtyLog, TReduceQtyResponse } from "@/types/ReduceQtyLog";
import { axiosInstance } from "./axios-cofig";
import { validateWithZod } from "@/lib/handle-error";
import { reduceQtyLogSchema } from "@/validations/reduceQtyLogs.schema";

export const reduceQty = async (
	reduceQtyData: Partial<TReduceQtyLog>,
): Promise<TReduceQtyResponse> => {
	const validatedData = await validateWithZod(reduceQtyLogSchema, {
		...reduceQtyData,
		quantity: Number(reduceQtyData?.quantity),
	});

	const response = await axiosInstance.patch(`/reduce-quantity`, validatedData);

	return response.data;
};
