import { Request, Response } from "express";
import {
	OrderResponse,
	TStoreInfo,
} from "~/types/shopify";
import {
	bulkUpdateOrdersStatusSchema,
	getShopifyOrdersSchema,
} from "~/validations/shopify.schema";
import { validateWithZod } from "~/utils/errorHandling";
import { bookSingleOrderAtPostEx } from "~/helper/postex-helper";
import { bookSingleOrderAtInsta } from "~/helper/insta-helper";
import { bookSingleOrderAtRocket } from "~/helper/rocket-helper";
import { handleCourierBooking } from "~/services/courier-booking.service";
import { bookAtCourierSchema } from "~/validations/shopify.schema";
import {
	SHOPIFY_CLIENT_FILTER_TABS,
	SHOPIFY_STATUS_QUERY_MAP,
} from "~/constants/shopifyOrders";
import {
	getStoresByIds,
	filterOrdersByTab,
	fetchBalancedOrders,
	updateShopifyOrderWdStatus,
	fetchOrdersFromShop,
} from "~/helper/shopify.helper";
import { CourierBookingResult, CourierOrderInput } from "~/types/courier-booking";
import { TShop } from "~/types/shop";
import Courier from "~/models/courier";


const courierBookingMap: Record<string,(shop: TShop, orderId: string, orderInput: CourierOrderInput) => Promise<CourierBookingResult>> = {
  PostEx: bookSingleOrderAtPostEx,
  Insta: bookSingleOrderAtInsta,
  Rocket: bookSingleOrderAtRocket,
};

export async function getShopifyOrders(req: Request, res: Response) {
	let validatedQuery;
	try {
		validatedQuery = await validateWithZod(getShopifyOrdersSchema, req.query);
	} catch (err) {
		return res.status(400).json({
			error: err instanceof Error ? err.message : "Invalid query parameters",
		});
	}

	const {
		store_id,
		status,
		q = "",
		page = 1,
		size = 10,
		cursor,
		city,
	} = validatedQuery;

	let stores: TStoreInfo[] = [];

	if (store_id) {
		const rawStoreIds = Array.isArray(store_id)
			? store_id.map(String)
			: [String(store_id)];

		const storeIds = Array.from(
			new Set(
				rawStoreIds
					.flatMap((id) => id.split(","))
					.map((id) => id.trim())
					.filter((id) => id.length > 0),
			),
		);

		try {
			stores = await getStoresByIds(storeIds);
		} catch (err) {
			console.error("Error fetching stores by IDs:", err);
			return res
				.status(500)
				.json({ error: "Failed to fetch store information" });
		}

		if (stores.length === 0) {
			return res.status(404).json({
				error: "No valid stores found for the provided store_id values",
			});
		}
	} else {
		stores = [
			{
				domain: "cosmos169.myshopify.com",
				accessToken: "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",
				shopKey: "cosmos169.myshopify.com",
				shopName: "Cosmos169",
			},
		];
	}

	let statusArr: string[] = [];
	if (Array.isArray(status)) {
		statusArr = status.map(String).filter((s) => s.trim() !== "");
	} else if (typeof status === "string" && status.trim() !== "") {
		statusArr = [status];
	} else if (status && String(status).trim() !== "") {
		statusArr = [String(status)];
	}

	const sizeNum = Number(size) || 10;
	let allOrders: OrderResponse[] = [];
	let hasNextPage = false;
	let hasPreviousPage = false;
	let endCursor: string | null = null;
	let startCursor: string | null = null;

	if (stores.length === 1) {
		const store = stores[0];
		const statusFilter = statusArr.length > 0 ? statusArr[0] : "";
		const statusQueryFragment = statusFilter
			? SHOPIFY_STATUS_QUERY_MAP[statusFilter.trim()] || null
			: null;
		const normalizedCity = city ? city.trim().toLowerCase() : "";
		const useClientFilter =
			(!!statusFilter && SHOPIFY_CLIENT_FILTER_TABS.has(statusFilter.trim())) ||
			!!normalizedCity;

		try {
			if (useClientFilter) {
				let currentCursor: string | null = cursor || null;
				const collected: OrderResponse[] = [];
				const fetchBatchSize = 250;
				let batchHasNextPage = true;
				let roundNum = 0;
				const maxRounds = 10;

				while (
					collected.length < sizeNum &&
					batchHasNextPage &&
					roundNum < maxRounds
				) {
					roundNum++;
					const result = await fetchOrdersFromShop(
						store,
						fetchBatchSize,
						q,
						currentCursor,
						statusQueryFragment,
						statusFilter,
						true, 
					);
					hasPreviousPage = result.hasPreviousPage;
					startCursor = result.startCursor;
					batchHasNextPage = result.hasNextPage;

					for (let i = 0; i < result.orders.length; i++) {
						const order = result.orders[i];
						const matchesStatusFilter =
							!statusFilter ||
							filterOrdersByTab([order], statusFilter).length > 0;
						const matchesCityFilter =
							!normalizedCity ||
							order.city.trim().toLowerCase() === normalizedCity;
						if (matchesStatusFilter && matchesCityFilter) {
							collected.push(order);
						}
						if (collected.length >= sizeNum) {
							endCursor = result.edgeCursors[i] ?? result.endCursor;
							hasNextPage = i < result.orders.length - 1 || result.hasNextPage;
							break;
						}
					}

					if (collected.length < sizeNum) {
						endCursor = result.endCursor;
						hasNextPage = result.hasNextPage;
						currentCursor = result.endCursor;
					}

					if (result.orders.length === 0 && !result.hasNextPage) break;
				}

				allOrders = collected.slice(0, sizeNum);
			} else {
 		 	const result = await fetchOrdersFromShop(
				store,
				sizeNum,
				q,
				cursor || null,
				statusQueryFragment,
				statusFilter,
				true,
			);
			allOrders = result.orders;
			hasNextPage = result.hasNextPage;
			hasPreviousPage = result.hasPreviousPage ?? false;
			endCursor = result.endCursor;
			startCursor = result.startCursor;
		}
		} catch (error: unknown) {
			console.error("Failed to fetch Shopify orders:", error);
		}

		const currentPageNum = Number(page) || 1;
		const estimatedTotal = hasNextPage
			? currentPageNum * sizeNum + 1
			: (currentPageNum - 1) * sizeNum + allOrders.length;

		return res.json({
			orders: allOrders,
			page: currentPageNum,
			size: sizeNum,
			total: estimatedTotal,
			hasNextPage,
			hasPreviousPage,
			endCursor,
			startCursor,
		});
	}

	let incomingCursors: Record<string, string> = {};
	if (cursor) {
		try {
			incomingCursors = JSON.parse(cursor as string);
		} catch {
			incomingCursors = {};
		}
	}

	try {
		const result = await fetchBalancedOrders(
			stores,
			sizeNum,
			q,
			statusArr,
			incomingCursors,
			city,
		);

		return res.json({
			orders: result.orders,
			page: Number(page) || 1,
			size: sizeNum,
			total: result.orders.length,
			hasNextPage: result.hasNextPage,
			shopCursors: result.shopCursors,
		});
	} catch (error) {
		console.error("Failed to fetch balanced orders:", error);
		return res.status(500).json({ error: "Failed to fetch orders" });
	}
}

export async function updateShopifyOrderStatus(req: Request, res: Response) {
	try {
		const { orderId, shopId, wd_status } = req.body;

		if (!orderId || !shopId || !wd_status) {
			return res.status(400).json({ error: "Missing fields" });
		}

		const data = await updateShopifyOrderWdStatus({
			shopId,
			orderId,
			wd_status,
		});

		return res.json({ success: true, data });
	} catch (error: unknown) {
		console.error("Metafield update error:", error);
		return res.status(500).json({
			error:
				error instanceof Error
					? error.message
					: "Failed to update order status",
		});
	}
}

export async function bookAtCourier(req: Request, res: Response) {
  try {
    const { courier_id } = req.body;

    if (!courier_id) {
      return res.status(400).json({ error: "courier_id is required" });
    }

    const courier = await Courier.findById(courier_id);
    if (!courier) {
      return res.status(404).json({ error: "Courier not found" });
    }

    const bookingFunction = courierBookingMap[courier.name];
    if (!bookingFunction) {
      return res.status(400).json({ error: `Unsupported courier: ${courier.name}` });
    }

    return handleCourierBooking({
      req,
      res,
      schema: bookAtCourierSchema,
      bookingFunction,
      courierName: courier.name,
    });
  } catch (error) {
    console.error("bookAtCourier error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function bulkUpdateOrdersStatus(req: Request, res: Response) {
	let validatedBody;
	try {
		validatedBody = await validateWithZod(
			bulkUpdateOrdersStatusSchema,
			req.body,
		);
	} catch (err) {
		return res.status(400).json({
			error: err instanceof Error ? err.message : "Invalid request body",
		});
	}

	try {
		const { orders, wd_status } = validatedBody;

		const results = await Promise.allSettled(
			orders.map(({ shopId, orderId }: { shopId: string; orderId: string }) =>
				updateShopifyOrderWdStatus({ shopId, orderId, wd_status }),
			),
		);

		const succeeded = results.filter((r) => r.status === "fulfilled").length;
		const failed = results.filter((r) => r.status === "rejected").length;

		if (failed === orders.length) {
			return res.status(500).json({
				error: "All orders failed to update",
				succeeded,
				failed,
				totalOrders: orders.length,
			});
		}

		return res.json({
			success: true,
			message:
				failed > 0
					? `${succeeded} orders updated, ${failed} failed`
					: `${succeeded} orders updated successfully`,
			succeeded,
			failed,
			totalOrders: orders.length,
			warning: failed > 0,
		});
	} catch (error: unknown) {
		console.error("Bulk status update error:", error);
		return res.status(500).json({
			error:
				error instanceof Error ? error.message : "Failed to bulk update orders",
		});
	}
}
