import {
	TCursorsState,
	TGetShopifyProductsResponse,
	TMergeShopifyOrdersPayload,
	TScanParcel,
	TShopifyOrderByIdsBody,
	TUpdateShopifyOrder,
	TUpdateShopifyOrderPayload,
} from "@/types/shopify";
import { axiosInstance } from "./axios-cofig";
import {
	bulkUpdateOrdersStatusSchema,
	mergeShopifyOrdersSchema,
	scanParcelSchema,
	updateShopifyOrderSchema,
} from "@/validations/shopify.schema";
import { validateWithZod } from "@/lib/handle-error";

const normalizeStoreIds = (storeIds: string[]): string[] =>
	Array.from(
		new Set(
			storeIds
				.flatMap((id) => String(id).split(","))
				.map((id) => id.trim())
				.filter(Boolean),
		),
	);

export const getShopifyOrdersQueryFn = async (
	shopIds: string[],
	activeStatus: string,
	debounceSearch: string,
	pageNo: number,
	pageSize: number,
	cursors: TCursorsState,
	setCursors: (updater: (prev: TCursorsState) => TCursorsState) => void,
	courier?: string,
	city?: string,
) => {
	const normalizedShopIds = normalizeStoreIds(shopIds);

	if (normalizedShopIds.length === 0) {
		return { orders: [], total: 0 };
	}

	const searchWithCourier = [debounceSearch, courier ? `tag:${courier}` : ""]
		.filter(Boolean)
		.join(" ");

	if (normalizedShopIds.length === 1) {
		const currentCursor = cursors[pageNo] as string | undefined;
		const result = await getShopifyOrders(
			normalizedShopIds[0],
			activeStatus,
			searchWithCourier,
			pageNo,
			pageSize,
			currentCursor,
			city,
		);

		if (result.endCursor && result.hasNextPage) {
			setCursors((prev) => ({
				...prev,
				[pageNo + 1]: result.endCursor,
			}));
		}

		if (courier) {
			const c = courier.toLowerCase();
			result.orders = result.orders.filter(
				(o: { trackingReference?: string }) =>
					o.trackingReference?.toLowerCase().includes(c),
			);
		}

		return result;
	}

	const currentCursors = (cursors[pageNo] as Record<string, string>) || {};
	const cursorParam =
		Object.keys(currentCursors).length > 0
			? JSON.stringify(currentCursors)
			: undefined;

	const result = await getShopifyOrdersMultiShop(
		normalizedShopIds,
		activeStatus,
		searchWithCourier,
		pageNo,
		pageSize,
		cursorParam,
		city,
	);

	if (result.shopCursors && result.hasNextPage) {
		setCursors((prev) => ({
			...prev,
			[pageNo + 1]: result.shopCursors,
		}));
	}

	if (courier) {
		const c = courier.toLowerCase();
		result.orders = result.orders.filter((o: { trackingReference?: string }) =>
			o.trackingReference?.toLowerCase().includes(c),
		);
	}

	return result;
};

export const getShopifyOrders = async (
	storeId: string,
	status?: string,
	search?: string,
	page: number = 1,
	size: number = 10,
	cursor?: string,
	city?: string,
) => {
	const response = await axiosInstance.get("/shopify-orders", {
		params: {
			store_id: storeId,
			status,
			q: search,
			page,
			size,
			cursor,
			city,
		},
	});
	return response.data;
};

export const getShopifyOrdersMultiShop = async (
	storeIds: string[],
	status?: string,
	search?: string,
	page: number = 1,
	size: number = 10,
	cursor?: string,
	city?: string,
) => {
	const normalizedStoreIds = normalizeStoreIds(storeIds);

	const response = await axiosInstance.get("/shopify-orders", {
		params: {
			store_id: normalizedStoreIds,
			status,
			q: search,
			page,
			size,
			cursor,
			city,
		},
	});
	return response.data;
};

export const updateShopifyOrderNote = async (
	storeId: string,
	orderId: string,
	note: string,
) => {
	const response = await axiosInstance.patch("/shopify-order-note", {
		store_id: storeId,
		order_id: orderId,
		note,
	});
	return response.data;
};

export const updateShopifyOrderAddress = async (
	storeId: string,
	orderId: string,
	address: object | string,
) => {
	const response = await axiosInstance.patch("/shopify-order-address", {
		store_id: storeId,
		order_id: orderId,
		address,
	});
	return response.data;
};

export const printOrders = async (data: TShopifyOrderByIdsBody) => {
	const response = await axiosInstance.post(`/print-orders`, data);
	return response.data?.orders;
};

export const updateShopifyOrderStatus = async (
	shopId: string,
	orderId: string,
	wd_status: string,
) => {
	const response = await axiosInstance.post("/shopify-order/status", {
		shopId,
		orderId,
		wd_status,
	});

	return response.data;
};

export const scanParcel = async (data: TScanParcel) => {
	const validData = await validateWithZod(scanParcelSchema, data);
	const response = await axiosInstance.post("/scan-parcel", validData);
	return response.data;
};

export const scanReturnParcel = async (data: TScanParcel) => {
	const validData = await validateWithZod(scanParcelSchema, data);
	const response = await axiosInstance.post("/scan-return-parcel", validData);
	return response.data;
};

export const getShopSalesAnalytics = async (
	storeId: string,
	startDate: string,
	endDate: string,
) => {
	const response = await axiosInstance.get("/shopify-sales-analytics", {
		params: {
			store_id: storeId,
			startDate,
			endDate,
		},
	});
	return response.data;
};

export const getShopifyOrdersByOrderIds = async (
	shopId: string,
	orderIds: string[],
) => {
	const response = await axiosInstance.get("/get-shopify-orders-by-ids", {
		params: {
			shopId,
			orderIds,
		},
	});
	return response.data.orders as TUpdateShopifyOrder[];
};

export const getShopifyProductByShopId = async ({
	shopId,
	size,
	cursor,
	q,
	signal,
}: {
	shopId: string;
	size: number;
	cursor?: string;
	q?: string;
	signal?: AbortSignal;
}) => {
	const response = await axiosInstance.get("/get-shopify-products", {
		params: {
			shopId,
			size,
			cursor,
			q,
		},
		signal,
	});
	return response.data as TGetShopifyProductsResponse;
};

export const bulkUpdateOrdersStatus = async (
	orders: Array<{ shopId: string; orderId: string }>,
	wd_status: string,
) => {
	const validPayload = await validateWithZod(bulkUpdateOrdersStatusSchema, {
		orders,
		wd_status,
	});
	const response = await axiosInstance.post(
		"/bulk-status-update",
		validPayload,
	);
	return response.data;
};

export const updateShopifyOrder = async ({
	data,
}: {
	data: TUpdateShopifyOrderPayload;
}) => {
	const validPayload = await validateWithZod(updateShopifyOrderSchema, data);
	const response = await axiosInstance.post(
		"/update-shopify-order",
		validPayload,
	);
	return response;
};

export const bookAtCourier = async (payload: {
  shop_id: string;
  courier_id: string;
  orders: {
    orderId: string;
    name: string;
    phone: string;
    address: string;
    city: string;
    cod: string;
    kg: string;
    type: string;
    items: number;
    remarks?: string;
  }[];
}) => {
  const response = await axiosInstance.post("/book-at-courier", payload);
  return response.data;
};

export const mergeShopifyOrders = async ({
	data,
}: {
	data: TMergeShopifyOrdersPayload;
}) => {
	const validPayload = await validateWithZod(mergeShopifyOrdersSchema, data);
	const response = await axiosInstance.post(
		"/merge-shopify-orders",
		validPayload,
	);
	return response;
};
