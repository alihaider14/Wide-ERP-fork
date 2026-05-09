import {z} from "zod";

export const updateTaskStatusSchema = z.object({
  status: z.enum(["Active", "Paused"], {
    errorMap: () => ({ message: "Status must be 'Active' or 'Paused'" }),
  }),
});

export type UpdateTaskStatusInput = z.infer<typeof updateTaskStatusSchema>;