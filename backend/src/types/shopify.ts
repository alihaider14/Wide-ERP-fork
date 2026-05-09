import z from "zod";
import {
	mergeShopifyOrdersSchema,
	scanParcelSchema,
	updateShopifyOrderSchema,
} from "~/validations/shopify.schema";

export interface ShopifyOrder {
	metafield: { id: string; value: string };
	wd_status?: { value?: string };
	printed_count?: { value?: string | number };
	address1: string;
	address2: string;
	id: string;
	name: string;
	email: string;
	createdAt: string;
	updatedAt?: string;
	subtotalPriceSet?: {
		shopMoney?: {
			amount?: string;
		};
	};
	currentSubtotalPriceSet?: {
		shopMoney?: {
			amount?: string;
		};
	};
	totalShippingPriceSet?: {
		shopMoney?: {
			amount?: string;
		};
	};
	currentShippingPriceSet?: {
		shopMoney?: {
			amount?: string;
		};
	};
	totalTaxSet?: {
		shopMoney?: {
			amount?: string;
			currencyCode?: string;
		};
	};
	currentTotalTaxSet?: {
		shopMoney?: {
			amount?: string;
			currencyCode?: string;
		};
	};
	totalPrice?: string;
	totalPriceSet?: {
		shopMoney?: {
			amount?: string;
			currencyCode?: string;
		};
	};
	currentTotalPriceSet?: {
		shopMoney?: {
			amount?: string;
			currencyCode?: string;
		};
	};
	financialStatus?: string;
	displayFinancialStatus?: string;
	fulfillmentStatus?: string;
	displayFulfillmentStatus?: string;
	lineItems: {
		edges: Array<{
			node: {
				title: string;
				sku?: string;
				quantity: number;
				currentQuantity: number;
				image?: {
					originalSrc?: string;
				};
				originalUnitPriceSet?: {
					shopMoney?: {
						amount?: string;
						currencyCode?: string;
					};
				};
			};
		}>;
	};
	customer?: {
		id?: string;
		firstName?: string;
		lastName?: string;
		phone?: string;
	} | null;
	shippingAddress?: {
		firstName?: string;
		lastName?: string;
		address1?: string;
		address2?: string;
		city?: string;
		province?: string;
		zip?: string;
		country?: string;
		phone?: string;
	} | null;
	tracking?: string;
	note?: string;
	fulfillments?: Array<{
		displayStatus: string;
		trackingInfo?: Array<{
			number?: string;
			company?: string;
		}>;
		events?: {
			edges: Array<{
				node: {
					status?: string;
					happenedAt?: string;
				};
			}>;
		};
	}>;
}

export interface ShopifyOrderEdge {
	node: ShopifyOrder;
	cursor?: string;
}

export interface ShopifyOrdersResponse {
	data: {
		orders: {
			edges: ShopifyOrderEdge[];
			pageInfo?: {
				hasNextPage?: boolean;
				hasPreviousPage?: boolean;
				endCursor?: string;
				startCursor?: string;
			};
		};
	};
	errors?: Array<{
		message: string;
		extensions?: unknown;
	}>;
}

export type OrderResponse = {
	order: string;
	customer: string;
	shop: string;
	shopKey: string;
	shopId: string;
	date: string;
	updatedAt?: string;
	phone: string;
	total: string;
	items: number;
	status: string;
	wd_status: string;
	delivery_status: string;
	tracking: string;
	trackingReference: string;
	destination: string;
	city: string;
	address2?: string;
	zip?: string;
	note: string;
	orderId: string;
	printed_count: number;
};

export type TPDFOrder = {
	shopId: string;
	storeName: string;
	shopifyStoreKey: string;
	storeLogo: string;
	courierName: string;
	orderDate: string;
	customerName: string;
	addressLine1: string;
	addressLine2: string;
	phone: string;
	city: string;
	state: string;
	orderNumber: string;
	note: string;
	trackingId: string;
	products: Array<{
		name: string;
		sku: string;
		price: number;
		quantity: number;
		total: number;
		image?: string;
	}>;
	subtotal: number;
	shipping: number;
	total: number;
	gstAmount: number;
	consigneeInformation: {
		name: string;
		contact: string;
		deliveryAddress: string;
	};
	shipperInformation: {
		name: string;
		contact: string;
		pickupAdress: string;
		returnAdress: string;
		details: string;
	};
	shipmentInformation: {
		pieces: number;
		orderRef: string;
		trackingNumber: string;
		origin: string;
		destination: string;
		returnCity: string;
		remarks: string;
	};
	orderInformation: {
		orderType: string;
		amount: number;
	};
};

export type TScanParcel = z.infer<typeof scanParcelSchema>;
export type TScanShopifyResponse = {
	sku: string;
	quantity: number;
	price: number;
	product_id: string;
	original_price: number;
	shopify_order_id: string;
	barcode?: string;
};

export type TShopifyCourierLineItem = {
	name: string;
	quantity: number;
	price: string | number;
	sku?: string;
};

export type TShopifyCountableLineItem = Pick<
	TShopifyCourierLineItem,
	"name" | "quantity"
>;

export type TShopifyLineItem = Pick<
	TScanShopifyResponse,
	"sku" | "quantity" | "price"
>;
export type TUnavailableScanShopifyItem = Pick<
	TScanShopifyResponse,
	"sku" | "quantity" | "price" | "barcode" | "shopify_order_id"
>;

export type TStoreInfo = {
	[x: string]: unknown;
	domain: string;
	accessToken: string;
	shopKey: string;
	shopName: string;
	shopId?: string;
};

export type TPrintStoreInfo = {
	domain: string;
	accessToken: string;
	shopId: string;
	shopName: string;
	storeLogo: string;
	storeKey: string;
};

export type TScanStoreInfo = {
	domain: string;
	accessToken: string;
	shopId: string;
};

export type TCourierBatchItem = {
	shopId: string;
	orderIds: string[];
};

export type TShopState = {
	store: TStoreInfo;
	cursor: string | null;
	active: boolean;
};

export type TShopifyProduct = {
	image: string;
	name: string;
	price: string;
	qty: number;
	sku: string;
	variantGid: string;
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

export type TUpdateShopifyOrderPayload = z.infer<
	typeof updateShopifyOrderSchema
>;
export type TMergeShopifyOrdersPayload = z.infer<
	typeof mergeShopifyOrdersSchema
>;

export type TShopifyUserError = { field: string[]; message: string };
export type TGraphQLClient = {
	query: <T = any>(
		query: string,
		variables?: Record<string, unknown>,
		context?: string,
	) => Promise<T>;
};

export type TDiscountApplication = {
	id: string;
	description: string;
	value: { amount?: string; percentage?: number };
};

export type TCalculatedLineItem = {
	id: string;
	quantity: number;
	variant: { id: string } | null;
	calculatedDiscountAllocations: {
		discountApplication: TDiscountApplication;
	}[];
};

export type TLineItemToProcess = {
	calculatedLineItemId: string;
	shopifyUnitPrice: number;
	editedPrice: number;
	qty: number;
	currencyCode: string;
	existingDiscount:
		| { id: string; amount: number; existingQty: number }
		| undefined;
};

export const LINE_ITEM_DISCOUNT_DESCRIPTION = "Discount" as const;

export type OrderCancelReason =
	| "CUSTOMER"
	| "FRAUD"
	| "INVENTORY"
	| "DECLINED"
	| "OTHER";

export type DeleteShopifyOrderOptions = {
	orderId: string;
	client: TGraphQLClient;
	cancelReason?: OrderCancelReason;
	restockOnCancel?: boolean;
};
