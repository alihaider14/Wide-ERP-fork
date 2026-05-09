import { z } from "zod";
export const createBillSchema = z.object({
	vendor: z.string().min(1, "Vendor is required"),
	bill_date: z.string().min(1, "Bill date is required"),
	items: z
		.array(
			z.object({
				product: z.string().min(1, "Product is required"),
				cost: z.number(),
				qty: z.number(),
				total_price: z.number(),
			}),
		)
		.min(1, "At least one item is required"),
});
export const updateBillSchema = z.object({
	_id: z.string().min(1, "Bill ID is required"),
	bill_no: z.number(),
	vendor: z.string().min(1, "Vendor is required"),
	bill_date: z.string().min(1, "Bill date is required"),
	items: z
		.array(
			z.object({
				product: z.string().min(1, "Product is required"),
				cost: z.number(),
				qty: z.number(),
				total_price: z.number(),
			}),
		)
		.min(1, "At least one item is required"),
});

export const getBillItemsSchema = z.object({
	bill_id: z.string().min(1, "bill_id is required"),
});
export const getBillsSchema = z.object({
	pageNo: z.string().transform(Number),
	size: z.string().transform(Number),
	q: z.string().optional(),
	start_date: z.string().optional(),
	end_date: z.string().optional(),
});
