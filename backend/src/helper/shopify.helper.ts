import axios from "axios";
import mongoose from "mongoose";
import Shop from "~/models/shop";
import {
	SHOPIFY_ORDER_GID_PREFIX,
	SHOPIFY_CLIENT_FILTER_TABS,
	SHOPIFY_STATUS_QUERY_MAP,
	SHOPIFY_UPDATED_AT_TABS,
} from "~/constants/shopifyOrders";
import { decryptApiKey } from "~/utils/encryption";
import {
	ShopifyOrder,
	ShopifyOrdersResponse,
	OrderResponse,
	TStoreInfo,
	TShopState,
} from "~/types/shopify";
import { TShop } from "~/types/shop";
import { assertNoUserErrors } from "./shopify-update-order.helper";

export const splitFullName = (
	fullName: string,
): { firstName: string; lastName: string } => {
	const parts = fullName.trim().split(/\s+/);
	return {
		firstName: parts[0] ?? "",
		lastName: parts.slice(1).join(" "),
	};
};

export function toShopifyOrderGid(orderId: string): string {
	return orderId.startsWith(SHOPIFY_ORDER_GID_PREFIX)
		? orderId
		: `${SHOPIFY_ORDER_GID_PREFIX}${orderId}`;
}

export function extractShopifyOrderId(orderId: string): string {
	if (orderId.startsWith(SHOPIFY_ORDER_GID_PREFIX))
		return orderId.split("/").pop() ?? "";

	return String(orderId);
}

export async function getStoresByIds(
	storeIds: string[],
): Promise<TStoreInfo[]> {
	const objectIds = storeIds
		.filter((id) => mongoose.Types.ObjectId.isValid(id))
		.map((id) => new mongoose.Types.ObjectId(id));

	if (objectIds.length === 0) {
		return [];
	}

	try {
		const shops: TShop[] = await Shop.find(
			{ _id: { $in: objectIds } },
			{ shopify_store_key: 1, shopify_api_key: 1, name: 1 },
		);

		return shops.map((shop) => ({
			domain: shop.shopify_store_key,
			accessToken: decryptApiKey(shop.shopify_api_key),
			shopKey: shop.shopify_store_key,
			shopName: shop.name,
			shopId: shop._id?.toString() ?? "",
		}));
	} catch (error) {
		console.error("Failed to get stores:", error);
		return [];
	}
}

export function buildOrderQuery(
	limit: number,
	q: string,
	cursor: string | null,
	statusQueryFragment: string | null,
	statusTab?: string,
	fullPageInfo = false,
): string {

	const pageInfoFields = fullPageInfo
	  ? `hasNextPage hasPreviousPage endCursor startCursor`
	  : `hasNextPage endCursor`;

	const parts: string[] = [];
	if (q && q.trim()) parts.push(q.trim());
	if (statusQueryFragment) parts.push(statusQueryFragment);

	const queryStr = parts.length > 0 ? parts.join(" ") : "";
	const afterClause = cursor ? `, after: "${cursor}"` : "";
	const escapedQuery = queryStr.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
	const queryArg = `query: "${escapedQuery}"`;
	const sortKey =
		statusTab && SHOPIFY_UPDATED_AT_TABS.has(statusTab)
			? "UPDATED_AT"
			: "CREATED_AT";

	return `{
    orders(first: ${limit}, ${queryArg}, sortKey: ${sortKey}, reverse: true${afterClause}) {
      pageInfo { ${pageInfoFields} }
      edges {
        cursor
        node {
          id
          name
          email
          createdAt
          updatedAt
          note
          currentTotalPriceSet {
            shopMoney {
              amount
              currencyCode
            }
          }
          displayFinancialStatus
          displayFulfillmentStatus
          wd_status: metafield(namespace: "custom", key: "wd_status") {
            value
          }
          printed_count: metafield(namespace: "custom", key: "printed_count") {
            value
          }
          lineItems(first: 10) {
            edges {
              node {
                title
                currentQuantity
                originalUnitPriceSet {
                  shopMoney {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
          customer {
            id
            firstName
            lastName
          }
          shippingAddress {
            firstName
            lastName
            address1
            address2
            city
            zip
            country
            phone
          }
          fulfillments {
            displayStatus
            trackingInfo {
              number
              company
            }
          }
        }
      }
    }
  }`;
}

export function mapOrderNode(
	order: ShopifyOrder,
	store: TStoreInfo,
): OrderResponse {
	const orderNumber: string = order.name ?? "";

	let customerName = "";
	if (order.customer && (order.customer.firstName || order.customer.lastName)) {
		customerName =
			`${order.customer.firstName ?? ""} ${order.customer.lastName ?? ""}`.trim();
	} else if (
		order.shippingAddress &&
		(order.shippingAddress.firstName || order.shippingAddress.lastName)
	) {
		customerName =
			`${order.shippingAddress.firstName ?? ""} ${order.shippingAddress.lastName ?? ""}`.trim();
	}

	let tracking = "";
	let trackingReference = "";
	let deliveryStatus = "";

	if (Array.isArray(order.fulfillments)) {
		for (const fulfillment of order.fulfillments) {
			if (
				fulfillment &&
				typeof fulfillment.displayStatus === "string" &&
				fulfillment.displayStatus.length > 0
			) {
				deliveryStatus = fulfillment.displayStatus;
			}

			if (fulfillment && Array.isArray(fulfillment.trackingInfo)) {
				for (const info of fulfillment.trackingInfo) {
					if (
						info &&
						typeof info.number === "string" &&
						info.number.length > 0
					) {
						tracking = info.number;
					}
					if (
						info &&
						typeof info.company === "string" &&
						info.company.length > 0
					) {
						trackingReference = info.company;
					}
					if (tracking && trackingReference) break;
				}
			}

			if (tracking && trackingReference && deliveryStatus) break;
		}
	}

	const numericOrderId = extractShopifyOrderId(order.id);

	return {
		orderId: numericOrderId,
		order: orderNumber,
		customer: customerName,
		shop: store.shopName ?? store.domain ?? "",
		shopKey: store.shopKey ?? store.domain ?? "",
		shopId: store.shopId ?? "",
		date: order.createdAt ?? "",
		updatedAt: order.updatedAt ?? "",
		phone: order.shippingAddress?.phone ?? "",
		total: order.currentTotalPriceSet?.shopMoney?.amount ?? "",
		items:
			order.lineItems?.edges?.reduce(
				(acc: number, li: { node: { currentQuantity: number } }) =>
					acc + (li.node.currentQuantity ?? 0),
				0,
			) ?? 0,
		status: order.displayFulfillmentStatus ?? "",
		wd_status: order.wd_status?.value || "Pending",
		printed_count: Number(order.printed_count?.value || 0),
		delivery_status: deliveryStatus,
		tracking,
		trackingReference,
		destination: order.shippingAddress
			? `${order.shippingAddress.address1 ?? ""}, ${order.shippingAddress.city ?? ""}, ${order.shippingAddress.country ?? ""}`.trim()
			: "",
		city: order.shippingAddress?.city ?? "",
		address2: order.shippingAddress?.address2 ?? "",
		zip: order.shippingAddress?.zip ?? "",
		note: order.note ?? "",
	};
}

export function filterOrdersByTab(
	orders: OrderResponse[],
	tabName: string,
): OrderResponse[] {
	if (!tabName || tabName === "All") return orders;

	return orders.filter((order) => {
		const wdStatus = order.wd_status || "";
		const deliveryStatus = (order.delivery_status || "").toUpperCase();
		const hasNoDeliveryStatus = !deliveryStatus;

		switch (tabName) {
			case "Pending":
				return hasNoDeliveryStatus && (!wdStatus || wdStatus === "Pending");
			case "Ready to Ship":
				return hasNoDeliveryStatus && wdStatus === "Ready to Ship";
			case "Scanned":
				return (
					(hasNoDeliveryStatus || deliveryStatus === "FULFILLED") &&
					wdStatus === "Scanned"
				);
			case "Booked":
				return (
					deliveryStatus === "FULFILLED" &&
					wdStatus !== "Scanned" &&
					wdStatus !== "Cancelled" &&
					wdStatus !== "Return Received"
				);
			default:
				return true;
		}
	});
}

export async function fetchOrdersFromShop(
	store: TStoreInfo,
	limit: number,
	q: string,
	cursor: string | null,
	statusQueryFragment: string | null,
	statusTab?: string,
	fullPageInfo = false, 
): Promise<{
	orders: OrderResponse[];
	edgeCursors: string[];
	hasNextPage: boolean;
	hasPreviousPage: boolean;
    endCursor: string | null;
    startCursor: string | null;
}> {
	const query = buildOrderQuery(
		limit,
		q,
		cursor,
		statusQueryFragment,
		statusTab,
		fullPageInfo,
	);

	try {
		const response = await axios.post<ShopifyOrdersResponse>(
			`https://${store.domain}/admin/api/2023-07/graphql.json`,
			{ query },
			{
				headers: {
					"X-Shopify-Access-Token": store.accessToken,
					"Content-Type": "application/json",
				},
				timeout: 15000,
			},
		);

		if (!response.data?.data?.orders) {
			return {
				orders: [],
				edgeCursors: [],
				hasNextPage: false,
				hasPreviousPage: false,
				endCursor: null,
				startCursor:null
			};
		}

		const pageInfo = response.data.data.orders.pageInfo;
		const edges = response.data.data.orders.edges;

		const edgeCursors = edges.map((edge) => edge.cursor || "");
		const mappedOrders = edges.map((edge) => mapOrderNode(edge.node, store));

		return {
			orders: mappedOrders,
			edgeCursors,
			hasNextPage: pageInfo?.hasNextPage ?? false,
			hasPreviousPage: pageInfo?.hasPreviousPage ?? false,
			endCursor: pageInfo?.endCursor ?? null,
			startCursor: pageInfo?.startCursor ?? null, 
		};
	} catch (error) {
		console.error(
			`Failed to fetch Shopify orders for store ${store.shopId || store.domain}:`,
			error,
		);
		return { 
			orders: [], 
			edgeCursors: [], 
			hasNextPage: false,
			hasPreviousPage: false, 
			endCursor: null, 
			startCursor: null,  
		};
	}
}

export async function fetchBalancedOrders(
	stores: TStoreInfo[],
	pageSize: number,
	q: string,
	statusArr: string[],
	incomingCursors: Record<string, string>,
	city?: string,
): Promise<{
	orders: OrderResponse[];
	shopCursors: Record<string, string>;
	hasNextPage: boolean;
}> {
	const hasIncomingCursors = Object.keys(incomingCursors).length > 0;
	const statusFilter = statusArr.length > 0 ? statusArr[0] : "";
	const statusQueryFragment = statusFilter
		? SHOPIFY_STATUS_QUERY_MAP[statusFilter.trim()] || null
		: null;
	const normalizedCity = city ? city.trim().toLowerCase() : "";
	const useClientFilter =
		(!!statusFilter && SHOPIFY_CLIENT_FILTER_TABS.has(statusFilter.trim())) ||
		!!normalizedCity;

	const shopStates: TShopState[] = stores.map((store) => {
		const shopId = store.shopId || "";
		return {
			store,
			cursor: incomingCursors[shopId] || null,
			active: hasIncomingCursors ? !!incomingCursors[shopId] : true,
		};
	});

	let collectedOrders: OrderResponse[] = [];
	const fetchBatchSize = 250;

	if (useClientFilter) {
		let roundNum = 0;
		const maxRounds = 10;

		while (
			collectedOrders.length < pageSize &&
			shopStates.some((s) => s.active) &&
			roundNum < maxRounds
		) {
			roundNum++;
			const activeShops = shopStates.filter((s) => s.active);
			const perShop = Math.min(
				Math.ceil(fetchBatchSize / activeShops.length),
				250,
			);

			const results = await Promise.allSettled(
				activeShops.map((shopState) =>
					fetchOrdersFromShop(
						shopState.store,
						perShop,
						q,
						shopState.cursor,
						statusQueryFragment,
						statusFilter,
					),
				),
			);

			results.forEach((settledResult, index) => {
				const shopState = activeShops[index];
				if (settledResult.status === "rejected") {
					activeShops[index].active = false;
					return;
				}

				const { orders, edgeCursors, hasNextPage, endCursor } =
					settledResult.value;

				for (let i = 0; i < orders.length; i++) {
					const order = orders[i];
					const matchesStatusFilter =
						!statusFilter ||
						filterOrdersByTab([order], statusFilter).length > 0;
					const matchesCityFilter =
						!normalizedCity ||
						order.city.trim().toLowerCase() === normalizedCity;
					if (matchesStatusFilter && matchesCityFilter) {
						collectedOrders.push(order);
					}
					if (collectedOrders.length >= pageSize) {
						shopState.cursor = edgeCursors[i] || endCursor || shopState.cursor;
						if (i >= orders.length - 1 && !hasNextPage)
							shopState.active = false;
						return;
					}
				}

				shopState.cursor = endCursor || shopState.cursor;
				if (!hasNextPage || orders.length === 0) shopState.active = false;
			});

			const sortField = SHOPIFY_UPDATED_AT_TABS.has(statusFilter)
				? "updatedAt"
				: "date";
			collectedOrders.sort(
				(a, b) =>
					new Date(b[sortField] || b.date).getTime() -
					new Date(a[sortField] || a.date).getTime(),
			);
		}
	} else {
		let remaining = pageSize;

		while (remaining > 0 && shopStates.some((s) => s.active)) {
			const activeShops = shopStates.filter((s) => s.active);
			const perShop = Math.ceil(remaining / activeShops.length);

			const results = await Promise.allSettled(
				activeShops.map((shopState) =>
					fetchOrdersFromShop(
						shopState.store,
						perShop,
						q,
						shopState.cursor,
						statusQueryFragment,
						statusFilter,
					),
				),
			);

			results.forEach((settledResult, index) => {
				const shopState = activeShops[index];
				if (settledResult.status === "rejected") {
					activeShops[index].active = false;
					return;
				}

				const { orders, hasNextPage, endCursor } = settledResult.value;
				if (orders.length > 0) collectedOrders.push(...orders);
				shopState.cursor = endCursor || shopState.cursor;
				if (!hasNextPage || orders.length === 0) shopState.active = false;
			});

			remaining = pageSize - collectedOrders.length;
		}
	}

	const sortField = SHOPIFY_UPDATED_AT_TABS.has(statusFilter)
		? "updatedAt"
		: "date";
	collectedOrders.sort(
		(a, b) =>
			new Date(b[sortField] || b.date).getTime() -
			new Date(a[sortField] || a.date).getTime(),
	);

	const finalOrders = collectedOrders.slice(0, pageSize);

	const shopCursors: Record<string, string> = {};
	shopStates.forEach((state) => {
		const shopId = state.store.shopId || "";
		if (shopId && state.cursor && state.active) {
			shopCursors[shopId] = state.cursor;
		}
	});

	const hasActiveShops = shopStates.some((s) => s.active);
	const hasNextPage =
		statusArr.length > 0
			? hasActiveShops
			: hasActiveShops && finalOrders.length === pageSize;

	return { orders: finalOrders, shopCursors, hasNextPage };
}

export async function updateShopifyOrderWdStatus({
	shopId,
	orderId,
	wd_status,
}: {
	shopId: string;
	orderId: string;
	wd_status: string;
}) {
	const { accessToken, domain } = await getShopDomainAndAccessToken(shopId);

	const query = `
    mutation orderUpdate($input: OrderInput!) {
      orderUpdate(input: $input) {
        order { id updatedAt }
        userErrors { field message }
      }
    }
  `;

	const ownerId = toShopifyOrderGid(orderId);

	const variables = {
		input: {
			id: ownerId,
			metafields: [
				{
					namespace: "custom",
					key: "wd_status",
					type: "single_line_text_field",
					value: wd_status,
				},
			],
		},
	};

	const response = await axios.post(
		`https://${domain}/admin/api/2023-07/graphql.json`,
		{ query, variables },
		{
			headers: {
				"X-Shopify-Access-Token": accessToken,
				"Content-Type": "application/json",
			},
		},
	);

	assertNoUserErrors(response.data?.data?.orderUpdate?.userErrors, "wd_status");

	return response.data;
}

export async function incrementShopifyOrderPrintedCount({
	shopId,
	orderId,
}: {
	shopId: string;
	orderId: string;
}) {
	const { accessToken, domain } = await getShopDomainAndAccessToken(shopId);

	const ownerId = toShopifyOrderGid(orderId);

	const readQuery = `
    query getOrderMetafield($id: ID!) {
      order(id: $id) {
        metafield(namespace: "custom", key: "printed_count") {
          value
        }
      }
    }
  `;

	const readResponse = await axios.post(
		`https://${domain}/admin/api/2023-07/graphql.json`,
		{ query: readQuery, variables: { id: ownerId } },
		{
			headers: {
				"X-Shopify-Access-Token": accessToken,
				"Content-Type": "application/json",
			},
		},
	);

	const existing = readResponse.data?.data?.order?.metafield?.value;
	const currentCount = existing ? parseInt(existing, 10) : 0;
	const newCount = currentCount + 1;

	const updateQuery = `
    mutation orderUpdate($input: OrderInput!) {
      orderUpdate(input: $input) {
        order { id updatedAt }
        userErrors { field message }
      }
    }
  `;

	const updateResponse = await axios.post(
		`https://${domain}/admin/api/2023-07/graphql.json`,
		{
			query: updateQuery,
			variables: {
				input: {
					id: ownerId,
					metafields: [
						{
							namespace: "custom",
							key: "printed_count",
							type: "number_integer",
							value: String(newCount),
						},
					],
				},
			},
		},
		{
			headers: {
				"X-Shopify-Access-Token": accessToken,
				"Content-Type": "application/json",
			},
		},
	);

	assertNoUserErrors(
		updateResponse.data?.data?.orderUpdate?.userErrors,
		"printed_count",
	);

	return { printed_count: newCount };
}

export async function getShopDomainAndAccessToken(store_id: string) {
	const shop = await Shop.findById(store_id, {
		shopify_store_key: 1,
		shopify_api_key: 1,
	});
	if (!shop) throw new Error(`Shop not found for id: ${store_id}`);

	return {
		domain: shop.shopify_store_key as string,
		accessToken: decryptApiKey(shop.shopify_api_key),
	};
}

export async function updateShopifyOrderShipperRemarks({
	gid,
	wd_shipper_remarks,
	accessToken,
	domain,
}: {
	gid: string;
	wd_shipper_remarks: string;
	domain: string;
	accessToken: string;
}) {
	const query = `
    mutation orderUpdate($input: OrderInput!) {
      orderUpdate(input: $input) {
        order { id updatedAt }
        userErrors { field message }
      }
    }
  `;

	const variables = {
		input: {
			id: gid,
			metafields: [
				{
					namespace: "custom",
					key: "wd_shipper_remarks",
					type: "single_line_text_field",
					value: wd_shipper_remarks,
				},
			],
		},
	};

	const response = await axios.post(
		`https://${domain}/admin/api/2023-07/graphql.json`,
		{
			query,
			variables,
		},
		{
			headers: {
				"X-Shopify-Access-Token": accessToken,
				"Content-Type": "application/json",
			},
		},
	);

	assertNoUserErrors(
		response.data?.data?.orderUpdate?.userErrors,
		"wd_shipper_remarks",
	);

	return response.data;
}
