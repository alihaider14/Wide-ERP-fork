import { z } from "zod";

export const addressObjectSchema = z
  .object({
    value: z.string().min(1, "address value is required").optional(),
    address1: z.string().min(1, "address1 (street) is required").optional(),
    city: z.string().min(1, "city is required").optional(),
    country: z.string().min(1, "country is required").optional(),
  })
  .passthrough()
  .refine(
    (val) =>
      !!val.value || !!val.address1 || !!val.city || !!val.country,
    {
      message:
        "Provide either 'value' or at least one of address1, city, or country",
      path: ["address"],
    },
  );

export const updateOrderAddressSchema = z.object({
  store_id: z.string().min(1, "store_id is required"),
  order_id: z.string().min(1, "order_id is required"),
  address: z.union([
    z.string().min(1, "address is required"), // "Street, City, Country"
    addressObjectSchema,
  ]),
});