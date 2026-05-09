import z from "zod";

export const reduceQtyLogSchema = z.object({
	reason: z.string().min(1, "Reason is required"),
	quantity: z.number().lt(0, "Quantity must be negative"),
	adjustment_id: z.string().trim(),
});
