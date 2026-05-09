import { ERROR_MESSAGES } from '@/constant/errorMessage';
import { z } from 'zod';

export const createAdjustQtySchema = z.object({
	product_id: z.string().trim(),
	cost: z.string({ required_error: ERROR_MESSAGES.costRequired })
		.trim()
		.min(1, { message: ERROR_MESSAGES.costRequired })
		.pipe(z.coerce.number().nonnegative({ message: ERROR_MESSAGES.cost })),
	quantity: z.string({ required_error: ERROR_MESSAGES.quantityRequired })
		.trim()
		.min(1, { message: ERROR_MESSAGES.quantityRequired })
		.pipe(z.coerce.number().positive({ message: ERROR_MESSAGES.quantity })),
	reason: z.string({ required_error: ERROR_MESSAGES.reason })
		.trim()
		.min(1, { message: ERROR_MESSAGES.reason }),
	created_by: z.string().trim(),
});

export const updateAdjustQtySchema = z.object({
	productQtyId: z.string().trim(),
	product_id: z.string().trim().optional(),
	reason: z.string().trim().optional(),
});

export const importAdjustQuantitiesSchema = z.array(
	z.object({
		sku: z.string().trim(),
		cost: z.coerce.number({
			required_error: ERROR_MESSAGES.costRequired,
			invalid_type_error: ERROR_MESSAGES.costRequired,
		}).nonnegative({ message: ERROR_MESSAGES.cost }),
		quantity: z.coerce.number({
			required_error: ERROR_MESSAGES.quantityRequired,
			invalid_type_error: ERROR_MESSAGES.quantityRequired,
		}).positive({ message: ERROR_MESSAGES.quantity }),
		created_by: z.string().trim().optional(),
		reason: z.string({ required_error: ERROR_MESSAGES.reason })
			.trim()
			.min(1, { message: ERROR_MESSAGES.reason }),
	}),
);
