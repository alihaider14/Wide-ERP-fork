import { z } from "zod";

export const getPaymentsSchema = z.object({
  page: z.string().transform(Number).default("1"),
  size: z.string().transform(Number).default("10"),
  q: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
});

export const createPaymentSchema = z.object({
  vendor_id: z.string().min(1, "Vendor is required"),
  paid_amount: z.number(),
  paid_at: z.string().min(1, "Paid at is required"),
  note: z.string().optional(),
});

export const updatePaymentSchema = z.object({
  _id: z.string().min(1, "Payment ID is required"),
  vendor_id: z.string().min(1, "Vendor is required"),
  paid_amount: z.number(),
  paid_at: z.string().min(1, "Paid at is required"),
  note: z.string().optional(),
});

export const deletePaymentSchema = z.object({
  payment_id: z.string().min(1, "Payment ID is required"),
});
