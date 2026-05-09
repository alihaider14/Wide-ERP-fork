import { ERROR_MESSAGES } from "@/constant/errorMessage";
import { PHONE_REGEX } from "@/constant/regexValidation";
import { z } from "zod";

export const addShopSchema = z.object({
	name: z.string().trim().max(50, { message: ERROR_MESSAGES.name }),
	phone: z
		.string({ required_error: ERROR_MESSAGES.phone })
		.min(11, ERROR_MESSAGES.phoneLeast)
		.regex(PHONE_REGEX, ERROR_MESSAGES.phoneInvalid),
	logo_url: z
		.string()
		.trim()
		.max(2048, { message: ERROR_MESSAGES.logoUrl })
		.url({ message: ERROR_MESSAGES.logoUrl })
		.optional(),
	facebook: z
		.string()
		.trim()
		.max(100, { message: ERROR_MESSAGES.facebook })
		.optional(),
	instagram: z
		.string()
		.trim()
		.max(100, { message: ERROR_MESSAGES.instagram })
		.optional(),
	snapchat: z
		.string()
		.trim()
		.max(100, { message: ERROR_MESSAGES.snapchat })
		.optional(),
	x: z.string().trim().max(100, { message: ERROR_MESSAGES.x }).optional(),
	youtube: z
		.string()
		.trim()
		.max(100, { message: ERROR_MESSAGES.youtube })
		.optional(),
	shopify_store_key: z
		.string()
		.trim()
		.max(100, { message: ERROR_MESSAGES.shopify_Store_Key }),
	shopify_api_key: z
		.string()
		.trim()
		.max(100, { message: ERROR_MESSAGES.shopify_api_key }),
	meta_ads_manager_id: z.string().trim().optional().nullable(),
	meta_business_manager_id: z.string().trim().optional().nullable(),
	meta_api_key: z.string().trim().optional().nullable(),
	expected_roas: z.coerce.number().optional().nullable(),
	// Removed courier API keys
});

export const updateShopSchema = z.object({
	shopId: z.string().trim(),
	name: z.string().trim().max(50, { message: ERROR_MESSAGES.name }).optional(),
	phone: z
		.string({ required_error: ERROR_MESSAGES.phone })
		.min(11, ERROR_MESSAGES.phoneLeast)
		.regex(PHONE_REGEX, ERROR_MESSAGES.phoneInvalid)
		.optional(),
	logo_url: z.preprocess(
		(val) => {
			if (typeof val === "string" && val.trim() === "") {
				return undefined;
			}
			return val;
		},
		z
			.string()
			.trim()
			.max(2048, { message: ERROR_MESSAGES.logoUrl })
			.url({ message: ERROR_MESSAGES.logoUrl })
			.optional(),
	),
	facebook: z
		.string()
		.trim()
		.max(100, { message: ERROR_MESSAGES.facebook })
		.optional(),
	instagram: z
		.string()
		.trim()
		.max(100, { message: ERROR_MESSAGES.instagram })
		.optional(),
	snapchat: z
		.string()
		.trim()
		.max(100, { message: ERROR_MESSAGES.snapchat })
		.optional(),
	x: z.string().trim().max(100, { message: ERROR_MESSAGES.x }).optional(),
	youtube: z
		.string()
		.trim()
		.max(100, { message: ERROR_MESSAGES.youtube })
		.optional(),
	shopify_store_key: z
		.string()
		.trim()
		.max(100, { message: ERROR_MESSAGES.shopify_Store_Key })
		.optional(),
	shopify_api_key: z
		.string()
		.trim()
		.max(100, { message: ERROR_MESSAGES.shopify_api_key })
		.optional(),
	meta_ads_manager_id: z.string().trim().optional().nullable(),
	meta_business_manager_id: z.string().trim().optional().nullable(),
	expected_roas: z.coerce.number().optional().nullable(),
	postex_api_key: z.string().trim().optional(),
	insta_api_key: z.string().trim().optional(),
	rocket_api_key: z.string().trim().optional(),
	blueex_api_key: z.string().trim().optional(),
});
