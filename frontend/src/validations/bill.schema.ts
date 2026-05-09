import { z } from "zod";
import { ERROR_MESSAGES } from "@/constant/errorMessage";

const billItemSchema = z.object({
	product: z.string(),
	sku: z.string(),
	barcode: z.string(),
	cost: z.number({ invalid_type_error: ERROR_MESSAGES.costRequired }).positive(ERROR_MESSAGES.cost),
	qty: z.number({ invalid_type_error: ERROR_MESSAGES.quantityRequired }).positive(ERROR_MESSAGES.quantity),
	remaining_qty: z.number().optional(),
	total_price: z.number(),
});

export const createBillSchema = z.object({
	vendor: z.string().trim().min(1, ERROR_MESSAGES.vendorRequired),
	bill_date: z.date({ required_error: ERROR_MESSAGES.dateRequired, invalid_type_error: ERROR_MESSAGES.dateRequired }),
	items: z.array(billItemSchema).min(1, ERROR_MESSAGES.itemsRequired),
});

export const updateBillSchema = z.object({
	_id: z.string().trim().min(1, ERROR_MESSAGES.billIdRequired),
	bill_no: z.number().positive(ERROR_MESSAGES.billNoRequired),
	vendor: z.string().trim().min(1, ERROR_MESSAGES.vendorRequired),
	bill_date: z.date().optional(),
	items: z.array(billItemSchema).min(1, ERROR_MESSAGES.itemsRequired),
});

export type CreateBillInput = z.infer<typeof createBillSchema>;
export type UpdateBillInput = z.infer<typeof updateBillSchema>;
