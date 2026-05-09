import { z } from "zod";

export const getDashboardSchema = z.object({
	from: z.coerce.date(),
	to: z.coerce.date(),
});
