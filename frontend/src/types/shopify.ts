import {
	mergeShopifyOrdersSchema,
	scanParcelSchema,
	updateShopifyOrderSchema,
} from "@/validations/shopify.schema";
import z from "zod";

export interface ShopifyRow {
	orderId: string;
	shopId: string;
	trackingReference: string;
	lineItems?: string;
	fulfillmentStatus?: string;
	financialStatus?: string;
	currency?: string;
	createdAt?: string;
	totalPrice?: string;
	email?: string;
	name?: string;
	shop: string;
	order: string;
	date: string;
	customer: string;
	total: string;
	items: number;
	status: string;
	wd_status: string;
	delivery_status: string;
	tracking: string;
	destination: string;
	city?: string;
	address2?: string;
	zip?: string;
	note?: string | null;
	phone?: string;
	printed_count: number;
}
export type TScanParcel = z.infer<typeof scanParcelSchema>;

export type TShopifyOrderByIdsBody = { shopId: string; orderId: string }[];
export type TPrintScannedOrder = Record<string, string[]>;
export type TNoteModalKind = "note" | "phone";

export type TCursorValue = string | Record<string, string>;
export type TCursorsState = Record<number, TCursorValue>;

export type TShopifyProduct = {
	image: string;
	name: string;
	price: string;
	qty: number;
	sku: string;
	actualQty?: number;
	actualPrice?: number;
	variantGid: string;
};

export type TPageInfo = {
	hasNextPage: boolean;
	hasPreviousPage: boolean;
	endCursor: string;
	startCursor: string;
};

export type TGetShopifyProductsResponse = {
	pageInfo: TPageInfo;
	products: TShopifyProduct[];
};

export type TUpdateShopifyOrder = {
	product: TShopifyProduct[];
	orderId: string;
	status: string;
	discount: string;
	deliveryCharges: string;
	totalAmount: string;
	customerName: string;
	phoneNo: string;
	address: string;
	apartmentSuit: string;
	postalCode: string;
	city: string;
	country: string;
	note: string;
	shippingRemarks: string;
};

export type TShopifyCustomerData = Pick<
	TUpdateShopifyOrder,
	| "customerName"
	| "phoneNo"
	| "address"
	| "city"
	| "country"
	| "note"
	| "apartmentSuit"
	| "postalCode"
>;

export type TShopifyMergedData = {
	product: TShopifyProduct[];
	discount: string;
	deliveryCharges: string;
	note: string;
	shippingRemarks: string;
	status: "Paid" | "Pending";
};

export type TUpdateShopifyOrderPayload = z.infer<
	typeof updateShopifyOrderSchema
>;
export type TMergeShopifyOrdersPayload = z.infer<
	typeof mergeShopifyOrdersSchema
>;
