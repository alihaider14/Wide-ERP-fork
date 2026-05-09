import { z } from "zod";

export const orderStatusSchema = z.object({
	order_id: z.string().trim(),
	status: z.enum(["completed", "drafted", "cancelled"]),
	user_id: z.string().trim(),
});
