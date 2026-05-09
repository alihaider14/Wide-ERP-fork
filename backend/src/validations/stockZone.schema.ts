import { z } from 'zod';

export const stockZoneSchema = z.object({
  name: z.string().nonempty('Name is required'),
});