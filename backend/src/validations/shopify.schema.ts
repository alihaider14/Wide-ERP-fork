import { z } from "zod";
import {
	EMPLOYEE_NAME_REGEX,
	NO_NEGATIVE_NUMBER,
	PHONE_REGEX,
	POSTAL_CODE,
} from "~/constants/employee";

export const addShopifyOrderSchema = z.object({
	shopDomain: z.string().min(1, "Shop domain is required"),
	accessToken: z.string().min(1, "Access token is required"),
	orderData: z.object({}).passthrough(),
});

export const fulfillShopifyOrderSchema = z.object({
	shopDomain: z.string().min(1, "Shop domain is required"),
	accessToken: z.string().min(1, "Access token is required"),
	orderId: z.string().min(1, "Order ID is required"),
	fulfillmentData: z.object({}).passthrough(),
});

export const getShopifyOrdersSchema = z.object({
	store_id: z.union([z.string(), z.array(z.string())]).optional(),
	status: z.union([z.string(), z.array(z.string())]).optional(),
	q: z.string().optional(),
	page: z.preprocess((v) => Number(v), z.number().int().min(1).optional()),
	size: z.preprocess((v) => Number(v), z.number().int().min(1).optional()),
	cursor: z.string().optional(),
	city: z.string().optional(),
});

export const bookAtCourierSchema = z.object({
  shop_id: z.string().min(1, "shop_id is required"),
  courier_id: z.string().min(1, "courier_id is required"),
  orders: z.array(
    z.object({
      orderId: z.string().min(1),
      name: z.string().min(1),
      phone: z.string().min(1),
      address: z.string().min(1),
      city: z.string().min(1),
      cod: z.string().min(1),
      kg: z.string().min(1),
      type: z.string().min(1),
      items: z.number().int().min(1),
      remarks: z.string().optional(),
    })
  ).min(1, "At least one order is required"),
});

export const scanParcelSchema = z.object({
	shopId: z.string().min(1, "Shop is required."),
	orderNo: z.string().min(1, "Order no is required."),
});

export const salesAnalyticsSchema = z.object({
	store_id: z.string().min(1, "store_id is required"),
	startDate: z.string().min(1, "startDate is required"),
	endDate: z.string().min(1, "endDate is required"),
});
export const getShopifyOrderByOrderIdSchema = z.object({
	shopId: z.string().min(1, "shopId is required"),
	orderIds: z
		.array(z.string().min(1, "orderId cannot be empty"))
		.min(1, "At least one orderId is required"),
});

export const bulkUpdateOrdersStatusSchema = z.object({
	orders: z
		.array(
			z.object({
				shopId: z.string().min(1, "shopId is required"),
				orderId: z.string().min(1, "orderId is required"),
			}),
		)
		.min(1, "At least one order is required"),
	wd_status: z.string().min(1, "wd_status is required"),
});

export const getShopifyProductsSchema = z.object({
	size: z.string().transform(Number),
	q: z.string().optional(),
	cursor: z.string().optional(),
	shopId: z
		.string({ message: "Shop ID is required." })
		.trim()
		.min(1, { message: "Shop ID is required." }),
});

const productSchema = z.object({
	variantGid: z.string().min(1, "Variant GID is required"),
	name: z.string().min(1, "Product name is required"),
	price: z
		.string()
		.min(1, "Price is required")
		.regex(NO_NEGATIVE_NUMBER, "Price must be a non-negative number")
		.refine((val) => Number(val) > 0, {
			message: "Price must be greater than 0",
		}),
	qty: z.number().min(1, "Quantity must be at least 1"),
	sku: z.string().min(1, "SKU is required"),
});

export const shopifyMetadataSchema = z.object({
	customerName: z
		.string()
		.trim()
		.regex(EMPLOYEE_NAME_REGEX, "Invalid customer name")
		.refine((val) => val.trim().split(/\s+/).length >= 2, {
			message: "Enter first and last name",
		}),
	phoneNo: z.string().regex(PHONE_REGEX, "Invalid phone number"),
	address: z.string().min(1, "Address is required"),
	city: z.string().min(1, "City is required"),
	country: z.string().min(1, "Country is required"),
	note: z.string().optional(),
	apartmentSuit: z.string().optional(),
	postalCode: z
		.string()
		.regex(POSTAL_CODE, "Invalid postal code")
		.optional()
		.or(z.literal("")),
});

export const editSessionSchema = z.object({
	product: z.array(productSchema).min(1, "At least one product is required"),
	discount: z
		.string()
		.regex(NO_NEGATIVE_NUMBER, "Discount must be a non-negative number")
		.refine((val) => !isNaN(Number(val.replace("%", ""))), {
			message: "Invalid discount value",
		})
		.refine((val) => Number(val.replace("%", "")) >= 0, {
			message: "Discount cannot be negative",
		}),

	deliveryCharges: z
		.string()
		.regex(
			NO_NEGATIVE_NUMBER,
			"Delivery Charges must be a non-negative number",
		),
});

export const updateShopifyOrderSchema = z
	.object({
		orderId: z.string().min(1, "Order ID is required"),
		shopId: z.string().min(1, "Shop ID is required"),
		metadata: shopifyMetadataSchema.optional(),
		editSession: editSessionSchema.optional(),
		status: z.string().optional(),
		shippingRemarks: z.string().optional(),
	})
	.superRefine((data, ctx) => {
		const hasChange =
			data.metadata !== undefined ||
			data.editSession !== undefined ||
			data.status !== undefined ||
			data.shippingRemarks !== undefined;

		if (!hasChange) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "At least one field group must be provided for update",
			});
		}
	});

export const mergeShopifyOrdersSchema = z
	.object({
		deletedOrderId: z.string().min(1, "Order ID is required"),
		mergedOrderId: z.string().min(1, "Merge order ID is required"),
		shopId: z.string().min(1, "Shop ID is required"),
		metadata: shopifyMetadataSchema.optional(),
		editSession: editSessionSchema.optional(),
		status: z.string().optional(),
		shippingRemarks: z.string().optional(),
	})
	.superRefine((data, ctx) => {
		const hasChange =
			data.metadata !== undefined ||
			data.editSession !== undefined ||
			data.status !== undefined ||
			data.shippingRemarks !== undefined;

		if (!hasChange) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "At least one field group must be provided for update",
			});
		}
	});
