import {ERROR_MESSAGES} from "@/constant/errorMessage";
import {z} from "zod";

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

const nameRegex = /^[A-Za-z\s]+$/;

export const addOrderSchema = z.object({
   customer_name: z
    .string()
    .trim()
    .min(4, { message: ERROR_MESSAGES.name })
    .regex(nameRegex, { message: "Name must contain only letters" }),
  customer_phone: z
    .string({
      required_error: ERROR_MESSAGES.phone,
    })
    .trim()
    .min(1, { message: ERROR_MESSAGES.phone })
    .refine((value) => /^[\d\s+-]+$/.test(value), {
      message: ERROR_MESSAGES.phoneInvalid,
    })
    .transform((value) => value.replace(/[\s-]/g, ""))
    .refine((value) => value.length >= 11, {
      message: ERROR_MESSAGES.phoneLeast,
    })
    .refine((value) => /^(\+92\d{10}|\d{11})$/.test(value), {
      message: ERROR_MESSAGES.phoneInvalid,
    }),

  discount: discountSchema,
  recieved_amount: z.coerce.number({
    required_error: ERROR_MESSAGES.recieved_amount,
    invalid_type_error: ERROR_MESSAGES.recieved_amount,
  }).nonnegative({ message: "Received amount must be a positive number" }),
  sub_total_amount: z.number(),
  created_by: z.string().trim(),
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
}).refine(
  (data) => {
    if (data.status === "completed") {
      return data.recieved_amount >= data.total_amount;
    }
    return true;
  },
  {
    message: "Received amount must be greater or equal to total amount",
    path: ["recieved_amount"],
  }
);

export const updateOrderSchema = z.object({
  order_id: z.string().trim(),
  customer_name: z
    .string()
    .trim()
    .min(4, { message: ERROR_MESSAGES.name })
    .regex(nameRegex, { message: "Name must contain only letters" }),
  customer_phone: z
    .string({
      required_error: ERROR_MESSAGES.phone,
    })
    .trim()
    .min(1, { message: ERROR_MESSAGES.phone })
    .refine((value) => /^[\d\s+-]+$/.test(value), {
      message: ERROR_MESSAGES.phoneInvalid,
    })
    .transform((value) => value.replace(/[\s-]/g, ""))
    .refine((value) => value.length >= 11, {
      message: ERROR_MESSAGES.phoneLeast,
    })
    .refine((value) => /^(\+92\d{10}|\d{11})$/.test(value), {
      message: ERROR_MESSAGES.phoneInvalid,
    }),
  discount: discountSchema,
  recieved_amount: z.coerce.number({
    required_error: ERROR_MESSAGES.recieved_amount,
    invalid_type_error: ERROR_MESSAGES.recieved_amount,
  }).nonnegative({ message: "Received amount must be a positive number" }),
  sub_total_amount: z.number(),
  total_amount: z.number(),
  items_count: z.number(),
  user_id: z.string().trim(),
  items: z.array(
    z.object({
      product_id: z.string().trim(),
      price: z.number(),
      quantity: z.number(),
      original_price: z.number(),
    }),
  ),
  status: z.enum(["completed", "drafted", "cancelled"]),
}).refine(
  (data) => {
    if (data.status === "completed") {
      return data.recieved_amount >= data.total_amount;
    }
    return true;
  },
  {
    message: "Received amount must be greater or equal to total amount",
    path: ["recieved_amount"],
  }
);
