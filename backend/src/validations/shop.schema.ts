import { z } from "zod";
import { SHOP_PHONE_REGEX } from "~/constants/employee";
import { PHONE_REGEX } from "~/constants/employee";

export const addShopSchema = z.object({
	name: z
		.string()
		.trim()
		.max(50, { message: "Maximum 50 characters allowed in shop name" }),
	phone: z
		.string({ required_error: "Phone no is required." })
		.min(11, "Phone no must be atleast 11 digits.")
		.regex(PHONE_REGEX, "Phone no is invalid."),
	logo_url: z.preprocess(
		(val) => {
			if (typeof val === "string" && val.trim() === "") return undefined;
			return val;
		},
		z
			.string()
			.trim()
			.max(2048, { message: "Logo URL is too long" })
			.url({ message: "Logo URL must be a valid URL" })
			.optional(),
	),
	facebook: z.string().trim().optional().nullable(),
	instagram: z.string().trim().optional().nullable(),
	snapchat: z.string().trim().optional().nullable(),
	x: z.string().trim().optional().nullable(),
	youtube: z.string().trim().optional().nullable(),
	shopify_store_key: z
		.string()
		.trim()
		.max(100, { message: "Maximum 100 characters allowed in store key" }),
	shopify_api_key: z
		.string()
		.trim()
		.max(100, { message: "Maximum 100 characters allowed in API key" }),
	meta_ads_manager_id: z.string().trim().optional().nullable(),
	meta_business_manager_id: z.string().trim().optional().nullable(),
	meta_api_key: z.string().trim().optional().nullable(),
	expected_roas: z.coerce.number().optional().nullable(),
	postex_api_key: z.string().trim().optional().nullable(),
	insta_api_key: z.string().trim().optional().nullable(),
	rocket_api_key: z.string().trim().optional().nullable(),
	blueex_api_key: z.string().trim().optional().nullable(),
});
export const updateShopSchema = z.object({
	shopId: z.string().trim(),
	name: z.string().trim().optional(),
	phone: z
		.string({ required_error: "Phone no is required." })
		.min(11, "Phone no must be atleast 11 digits.")
		.regex(SHOP_PHONE_REGEX, "Phone no is invalid.")
		.optional(),
	logo_url: z.preprocess(
		(val) => {
			if (typeof val === "string" && val.trim() === "") return undefined;
			return val;
		},
		z
			.string()
			.trim()
			.max(2024, { message: "Logo URL is too long" })
			.url({ message: "Logo URL must be a valid URL" })
			.optional()
			.nullable(),
	),
	facebook: z.string().trim().optional().nullable(),
	instagram: z.string().trim().optional().nullable(),
	snapchat: z.string().trim().optional().nullable(),
	x: z.string().trim().optional().nullable(),
	youtube: z.string().trim().optional().nullable(),
	shopify_store_key: z.string().trim().optional(),
	shopify_api_key: z.string().trim().optional(),
	meta_ads_manager_id: z.string().trim().optional().nullable(),
	meta_business_manager_id: z.string().trim().optional().nullable(),
	meta_api_key: z.string().trim().optional().nullable(),
	expected_roas: z.coerce.number().optional().nullable(),
	postex_api_key: z.string().trim().optional().nullable(),
	insta_api_key: z.string().trim().optional().nullable(),
	rocket_api_key: z.string().trim().optional().nullable(),
	blueex_api_key: z.string().trim().optional().nullable(),
	status: z.enum(["Active", "Disabled"]).optional(),
});
export const getShopsSchema = z.object({
	pageNo: z
		.string()
		.optional()
		.transform((val) => (val ? Number(val) : undefined)),
	size: z
		.string()
		.optional()
		.transform((val) => (val ? Number(val) : undefined)),
	q: z.string().optional(),
	status: z.string().optional(),
	filter: z.string().optional(),
	sortBy: z.enum(["name", "phone", "createdAt"]).optional(),
	sortOrder: z.enum(["asc", "desc"]).optional(),
});
