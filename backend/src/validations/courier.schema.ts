import { z } from "zod";

export const courierSchema = z.object({
	name: z.enum(["PostEx", "Insta", "Rocket"], {
		errorMap: () => ({ message: "Name must be PostEx, Insta or Rocket." }),
	}),
	shop: z.string().min(1, "Shop is required"),
	api_key: z.string().min(1, "API Key is required"),
	status: z.enum(["Active", "Disabled"], {
		errorMap: () => ({ message: "Status must be Active or Disabled" }),
	}),
	address_code: z.string().optional(),
	pickup_address: z.string().min(1, "Pickup address is required"),
	return_address: z.string().min(1, "Return address is required"),
  })
  .superRefine((data, ctx) => {
    if (data.name === "PostEx" && !data.address_code) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Address code is required for PostEx",
        path: ["address_code"],
      });
    }
	
});

export const updateCourierSchema = z.object({
	name: z.enum(["PostEx", "Insta", "Rocket"], {
		errorMap: () => ({ message: "Name must be PostEx, Insta or Rocket." }),
	}),
	shop: z.string().min(1, "Shop is required"),
	api_key: z.string().optional(),
	status: z.enum(["Active", "Disabled"], {
		errorMap: () => ({ message: "Status must be Active or Disabled" }),
	}),
	address_code: z.string().optional(),
	pickup_address: z.string().min(1, "Pickup address is required"),
	return_address: z.string().min(1, "Return address is required"),
  })
  .superRefine((data, ctx) => {
    if (data.name === "PostEx" && !data.address_code) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Address code is required for PostEx",
        path: ["address_code"],
      });
    }
});

export type CourierInput = z.infer<typeof courierSchema>;
