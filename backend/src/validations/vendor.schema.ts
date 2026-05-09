import { z } from "zod";

export const createVendorSchema = z.object({
  full_name: z
    .string({ required_error: "Vendor name is required" })
    .trim()
    .min(1, { message: "Vendor name is required" })
    .max(255, { message: "Vendor name must not exceed 255 characters" })
    .regex(/^[a-zA-Z ]+$/, { message: "Name can only contain letters and spaces" }),
  email: z
    .string()
    .email({ message: "Please provide a valid email address" })
    .trim()
    .toLowerCase()
    .optional()
    .or(z.literal(""))
    .or(z.null()),
  phone: z
    .string({ required_error: "Phone number is required" })
    .trim()
    .min(1, { message: "Phone number is required" }),
  address: z.string().trim().max(255).optional().default(""),
  opening_balance: z.number().default(0),
});

export const updateVendorSchema = z.object({
  vendorId: z.string().trim().optional(),
  _id: z.string().trim().optional(),
  full_name: z
    .string()
    .trim()
    .min(1, { message: "Vendor name cannot be empty" })
    .max(255, { message: "Vendor name must not exceed 255 characters" })
    .optional(),
  email: z
    .string()
    .email({ message: "Please provide a valid email address" })
    .trim()
    .toLowerCase()
    .optional()
    .or(z.literal(""))
    .or(z.null()),
  phone: z
    .string()
    .trim()
    .min(1, { message: "Phone number cannot be empty" })
    .optional(),
  address: z.string().trim().max(255).optional().default(""),
});

export const getVendorsSchema = z.object({
  page: z.string().transform(Number).default("1"),
  size: z.string().transform(Number).default("10"),
  q: z.string().optional(),
});
