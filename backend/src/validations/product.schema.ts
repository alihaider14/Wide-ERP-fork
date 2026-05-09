import { z } from "zod";

export const addProductSchema = z.object({
	name: z.string().optional(),
	barcode: z
		.string()
		.trim()
		.max(10, { message: "Maximum 80 characters allowed in Barcode" }),
	sku: z
		.string()
		.trim()
		.max(80, { message: "Maximum 80 characters allowed in SKU" }),
	price: z
		.string({ required_error: "Price is required." })
		.trim()
		.min(1, { message: "Price is required." })
		.pipe(
			z.coerce.number().nonnegative({ message: "Price must be positive." }),
		),
	low_stock_indicator: z.coerce
		.number({
			message: "Low stock quantity is required.",
		})
		.int({ message: "Low stock quantity cannot be decimals." })
		.nonnegative({ message: "Low stock quantity must be positive." })
		.optional(),
});

export const updateProductSchema = z.object({
	name: z.string().optional(),
	productId: z.string().trim(),
	barcode: z.string().trim().optional(),
	sku: z.string().trim().optional(),
	price: z
		.string({ required_error: "Price is required." })
		.trim()
		.min(1, { message: "Price is required." })
		.pipe(z.coerce.number().nonnegative({ message: "Price must be positive." }))
		.optional(),
	low_stock_indicator: z.coerce
		.number({
			message: "Low stock quantity is required.",
		})
		.int({ message: "Low stock quantity cannot be decimals." })
		.nonnegative({ message: "Low stock quantity must be positive." })
		.optional(),
});

export const getProductsSchema = z.object({
	pageNo: z.string().transform(Number),
	size: z.string().transform(Number),
	q: z.string().optional(),
	status: z.string().optional(),
	filter: z.string().optional(),
	sortBy: z.enum(["sku", "price", "qty"]).optional(),
	sortOrder: z.enum(["asc", "desc"]).optional(),
});
