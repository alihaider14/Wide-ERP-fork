import {z} from "zod";
import {ERROR_MESSAGES} from "~/constants/errorMessages";

const discountSchema = z
  .string()
  .trim()
  .optional()
  .refine(
    (value) => {
      if (!value) return true;
      const fixedDiscount = /^[0-9]+(\.[0-9]+)?$/;
      const percentDiscount = /^[0-9]+(\.[0-9]+)?%$/;

      return fixedDiscount.test(value) || percentDiscount.test(value);
    },
    {
      message: ERROR_MESSAGES.discount,
    },
  );

export const addOrderSchema = z.object({
  customer_name: z.string().trim().min(4, ERROR_MESSAGES.name),
  customer_phone: z
    .string({
      required_error: ERROR_MESSAGES.phone,
    })
    .trim()
    .transform((value) => value.replace(/[\s-]/g, ""))
    .refine((value) => value.length >= 11, {
      message: ERROR_MESSAGES.phoneLeast,
    })
    .refine((value) => /^(\+92\d{10}|\d{11})$/.test(value), {
      message: ERROR_MESSAGES.phoneInvalid,
    }),
  discount: discountSchema,
  recieved_amount: z.number({required_error: ERROR_MESSAGES.recieved_amount}),
  sub_total_amount: z.number(),
  total_amount: z.number(),
  items_count: z.number(),
  items: z.array(
    z.object({
      product_id: z.string().trim(),
      price: z.number(),
      original_price: z.number(),
      quantity: z.number(),
    }),
  ),
  status: z.enum(["completed", "drafted", "cancelled"]),
});

export const updateOrderSchema = z.object({
  order_id: z.string().trim(),
  customer_name: z.string().trim().min(4, ERROR_MESSAGES.name),
  customer_phone: z
    .string({
      required_error: ERROR_MESSAGES.phone,
    })
    .trim()
    .transform((value) => value.replace(/[\s-]/g, ""))
    .refine((value) => value.length >= 11, {
      message: ERROR_MESSAGES.phoneLeast,
    })
    .refine((value) => /^(\+92\d{10}|\d{11})$/.test(value), {
      message: ERROR_MESSAGES.phoneInvalid,
    }),
  discount: discountSchema,
  recieved_amount: z.number({required_error: ERROR_MESSAGES.recieved_amount}),
  sub_total_amount: z.number(),
  total_amount: z.number(),
  items_count: z.number(),
  items: z.array(
    z.object({
      product_id: z.string().trim(),
      price: z.number(),
      quantity: z.number(),
      original_price: z.number(),
    }),
  ),
  status: z.enum(["completed", "drafted", "cancelled"]),
});
