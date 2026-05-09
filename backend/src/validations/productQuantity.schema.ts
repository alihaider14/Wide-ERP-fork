import { z } from 'zod';

export const createAdjustQtySchema = z.object({
  product_id: z.string().trim(),
  created_by: z.string().trim(),
  cost: z.number().min(0, 'Cost must be a positive number'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  reason: z.string().trim(),
});

export const updateAdjustQtySchema = z.object({
  productQtyId: z.string().trim(),
  product_id: z.string().trim().optional(),
  reason: z.string().trim().optional(),
});

export const getProductQtySchema = z.object({
  pageNo: z.string().transform(Number),
  size: z.string().transform(Number),
  product_id: z.string().trim(),
  q: z.string().optional(),
  from: z.date().optional(),
  to: z.date().optional(),
});
