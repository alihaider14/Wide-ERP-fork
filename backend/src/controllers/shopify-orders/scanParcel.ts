import { Response } from "express";
import axios from "axios";
import Shop from "../../models/shop";
import Product from "../../models/product";
import { decryptApiKey } from "~/utils/encryption";
import { validateWithZod } from "~/utils/errorHandling";
import { scanParcelSchema } from "~/validations/shopify.schema";
import {
	ShopifyOrder,
	TScanParcel,
	TScanShopifyResponse,
	TShopifyLineItem,
	TScanStoreInfo,
	TUnavailableScanShopifyItem,
} from "~/types/shopify";
import ProductsQuantity from "~/models/products_quantity";
import OrderItems from "~/models/order_items";
import {
	extractShopifyOrderId,
	updateShopifyOrderWdStatus,
} from "~/helper/shopify.helper";
import { generateBarcode } from "~/services/background.service";
import User from "~/models/user";
import { logActivity } from "~/services/activity-logger.service";
import { TAuthenticatedRequest } from "~/types/express";
import { ERROR_MESSAGES } from "~/constants/errorMessages";
import { TShop } from "~/types/shop";

async function fetchShopifyOrder(orderNo: string, store: TScanStoreInfo) {
	try {
		const response = await axios.post(
			`https://${store.domain}/admin/api/2023-07/graphql.json`,
			{
				query: `
        query getOrderByName($query: String!) {
          orders(first: 1, query: $query) {
            edges {
              node {
                id
                name
                createdAt
                note
                totalPriceSet {
                  shopMoney {
                    amount
                    currencyCode
                  }
                }
                displayFulfillmentStatus
                metafield(namespace: "custom", key: "wd_status") {
                  value
                }
                customer {
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
                lineItems(first: 50) {
                  edges {
                    node {
                      sku
                      quantity
                      originalUnitPriceSet {
                        shopMoney {
                          amount
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        `,
				variables: { query: `name:${orderNo.replace("#", "")}` },
			},
			{
				headers: {
					"X-Shopify-Access-Token": store.accessToken,
					"Content-Type": "application/json",
				},
			},
		);

		return response.data?.data?.orders?.edges?.[0]?.node;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			if (error.code === "ENOTFOUND") {
				throw new Error(ERROR_MESSAGES.shopifyStoreNotConnected);
			}
			if (error.code === "ECONNREFUSED" || error.code === "ETIMEDOUT") {
				throw new Error(ERROR_MESSAGES.shopifyStoreError);
			}

			const status = error.response?.status;
			if (status === 401) throw new Error(ERROR_MESSAGES.shopifyUnauthorized);
			if (status === 402) throw new Error(ERROR_MESSAGES.shopifyStoreFrozen);
			if (status === 403) throw new Error(ERROR_MESSAGES.shopifyForbidden);
			if (status === 404)
				throw new Error(ERROR_MESSAGES.shopifyStoreNotConnected);
			if (status === 423) throw new Error(ERROR_MESSAGES.shopifyStoreLocked);
			if (status === 429) throw new Error(ERROR_MESSAGES.shopifyRateLimited);
			if (status && status >= 500)
				throw new Error(ERROR_MESSAGES.shopifyServerError);
			throw new Error(ERROR_MESSAGES.shopifyStoreError);
		}
		throw error;
	}
}

function mapShopifyItems(order: ShopifyOrder): TShopifyLineItem[] {
	return order.lineItems.edges.map(({ node }) => ({
		sku: node?.sku ?? "",
		quantity: node?.quantity ?? 0,
		price: Number(node?.originalUnitPriceSet?.shopMoney?.amount ?? 0),
	}));
}

async function splitProducts(
	items: TShopifyLineItem[],
	shopifyOrderId: string,
): Promise<{
	availableProducts: TScanShopifyResponse[];
	unavailableProducts: TUnavailableScanShopifyItem[];
}> {
	const availableProducts: TScanShopifyResponse[] = [];
	const unavailableProducts: TUnavailableScanShopifyItem[] = [];

	const skus = items.map((i) => i.sku);
	const products = await Product.find({ sku: { $in: skus } });
	const productMap = new Map(products.map((p) => [p.sku, p]));

	for (const item of items) {
		const product = productMap.get(item.sku);

		if (!product) {
			unavailableProducts.push({
				...item,
				barcode: generateBarcode(),
				shopify_order_id: shopifyOrderId,
			});
			continue;
		}

		availableProducts.push({
			...item,
			product_id: product._id,
			shopify_order_id: shopifyOrderId,
			original_price: product.price,
		});
	}

	return { availableProducts, unavailableProducts };
}

async function updateProductQuantity(items: TScanShopifyResponse[]) {
	try {
		await Promise.all(
			items.map(async (item) => {
				await Product.findByIdAndUpdate(item.product_id, {
					$inc: { qty: -item.quantity },
				});
			}),
		);
	} catch (error) {
		throw error;
	}
}

async function restockProductsAndCreateQuantityEntries(
	items: TScanShopifyResponse[],
) {
	await Promise.all(
		items.map(async (item) => {
			await Product.findByIdAndUpdate(item.product_id, {
				$inc: { qty: item.quantity },
			});

			await ProductsQuantity.create({
				product_id: item.product_id,
				quantity: item.quantity,
				remaining_qty: item.quantity,
				cost: item.price,
			});
		}),
	);
}

export const scanParcel = async (req: TAuthenticatedRequest, res: Response) => {
	try {
		const { orderNo, shopId } = await validateWithZod(
			scanParcelSchema,
			req.body,
		);

		const shop = await Shop.findById(shopId);
		if (!shop)
			return res.status(404).json({ error: ERROR_MESSAGES.shopNotFound });

		const store: TScanStoreInfo = {
			domain: shop.shopify_store_key,
			accessToken: decryptApiKey(shop.shopify_api_key),
			shopId: shop._id.toString(),
		};

		const shopifyOrder = await fetchShopifyOrder(orderNo, store);

		if (!shopifyOrder)
			return res
				.status(404)
				.json({ error: ERROR_MESSAGES.shopifyOrderNotFound(orderNo) });

		if (shopifyOrder?.metafield?.value === "Scanned")
			return res
				.status(400)
				.json({ error: ERROR_MESSAGES.shopifyOrderAlreadyScanned(orderNo) });

		const shopifyItems = mapShopifyItems(shopifyOrder);

		const { availableProducts, unavailableProducts } = await splitProducts(
			shopifyItems,
			shopifyOrder.id,
		);

		const availableOrderItems = await getOrderItems(availableProducts);
		const unavailableOrderItems =
			await getUnavailableOrderItems(unavailableProducts);

		const orderItems = [...availableOrderItems, ...unavailableOrderItems];

		await updateProductQuantity(availableProducts);

		await OrderItems.insertMany(orderItems);

		const data = await updateShopifyOrderWdStatus({
			shopId,
			orderId: shopifyOrder.id,
			wd_status: "Scanned",
		});

		const userId = req.user?._id;
		const shopifyOrderId = shopifyOrder.id.split("/").pop();
		if (userId) {
			const user = await User.findById(userId);

			await logActivity({
				type: "scan_parcel",
				moduleID: shopifyOrderId,
				activity: `Order ${orderNo} scanned by ${user?.full_name || "User"}.`,
				activistId: userId,
			});
		} else {
			console.warn("Activity not logged: User ID not found in request");
		}

		const mappedOrder = buildMappedOrder(shopifyOrder, shop, "Scanned");
		return res.status(200).json({ orderNo, data, order: mappedOrder });
	} catch (error) {
		console.error(error);
		const errorMessage =
			error instanceof Error ? error.message : "Internal Server Error";
		return res.status(500).json({ error: errorMessage });
	}
};

export const scanReturnParcel = async (
	req: TAuthenticatedRequest,
	res: Response,
) => {
	try {
		const { orderNo, shopId }: TScanParcel = await validateWithZod(
			scanParcelSchema,
			req.body,
		);

		const shop = await Shop.findById(shopId);
		if (!shop)
			return res.status(404).json({ error: ERROR_MESSAGES.shopNotFound });

		const store: TScanStoreInfo = {
			domain: shop.shopify_store_key,
			accessToken: decryptApiKey(shop.shopify_api_key),
			shopId: shop._id.toString(),
		};

		const shopifyOrder = await fetchShopifyOrder(orderNo, store);

		if (!shopifyOrder)
			return res
				.status(404)
				.json({ error: ERROR_MESSAGES.shopifyOrderNotFound(orderNo) });

		if (shopifyOrder?.metafield?.value === "Return Received")
			return res
				.status(400)
				.json({ error: ERROR_MESSAGES.shopifyOrderAlreadyReturned(orderNo) });

		const shopifyItems = mapShopifyItems(shopifyOrder);

		const { availableProducts } = await splitProducts(
			shopifyItems,
			shopifyOrder.id,
		);

		await restockProductsAndCreateQuantityEntries(availableProducts);

		const data = await updateShopifyOrderWdStatus({
			shopId,
			orderId: shopifyOrder.id,
			wd_status: "Return Received",
		});

		const userId = req.user?._id;
		const shopifyOrderId = shopifyOrder.id.split("/").pop();
		if (userId) {
			const user = await User.findById(userId);

			await logActivity({
				type: "scan_parcel",
				moduleID: shopifyOrderId,
				activity: `Order ${orderNo} returned by ${user?.full_name || "User"}.`,
				activistId: userId,
			});
		} else {
			console.warn("Activity not logged: User ID not found in request");
		}

		const mappedOrder = buildMappedOrder(shopifyOrder, shop, "Return Received");

		return res.status(200).json({ orderNo, data, order: mappedOrder });
	} catch (error) {
		console.error(error);
		const errorMessage =
			error instanceof Error ? error.message : "Internal Server Error";
		return res.status(500).json({ error: errorMessage });
	}
};

const getOrderItems = async (items: TScanShopifyResponse[]) => {
	try {
		const checkedItems = await Promise.all(
			items?.map(async (item) => {
				let remainingQty = item.quantity;

				const allocations = [];
				const batches = await ProductsQuantity.find({
					product_id: item.product_id,
					remaining_qty: { $gt: 0 },
				}).sort({ createdAt: 1 });

				for (const batch of batches) {
					if (remainingQty <= 0) break;

					const deductQty = Math.min(batch.remaining_qty, remainingQty);
					await ProductsQuantity.updateOne(
						{ _id: batch._id },
						{ $inc: { remaining_qty: -deductQty } },
					);

					allocations.push({
						product_quantity_id: batch._id,
						allocated_quantity: deductQty,
						allocated_cost: batch?.cost,
					});

					remainingQty -= deductQty;
				}

				return {
					product_id: item.product_id,
					price: item.price,
					original_price: item.original_price,
					quantity: item.quantity,
					shopify_order_id: item.shopify_order_id,
					allocations,
				};
			}),
		);

		return checkedItems;
	} catch (error) {
		throw error;
	}
};

const getUnavailableOrderItems = async (items: TUnavailableScanShopifyItem[]) => {
	const results = await Promise.all(
		items.map(async (item) => {
			const product = await Product.create({
				sku: item.sku,
				barcode: item.barcode,
				price: item.price,
				qty: -item.quantity,
			});

			const batch = await ProductsQuantity.create({
				product_id: product._id,
				quantity: item.quantity,
				remaining_qty: -item.quantity,
				cost: 0,
				barcode: item.barcode,
			});

			return {
				product_id: product._id,
				price: item.price,
				original_price: 0,
				quantity: item.quantity,
				shopify_order_id: item.shopify_order_id,
				allocations: [
					{
						product_quantity_id: batch._id,
						allocated_quantity: item.quantity,
						allocated_cost: 0,
					},
				],
			};
		}),
	);
	return results;
};

function buildMappedOrder(shopifyOrder: ShopifyOrder, shop: TShop, wdStatus: string) {
	let customerName = "";
	if (shopifyOrder.customer) {
		customerName =
			`${shopifyOrder.customer?.firstName ?? ""} ${shopifyOrder.customer?.lastName ?? ""}`.trim();
	} else if (shopifyOrder.shippingAddress) {
		customerName =
			`${shopifyOrder.shippingAddress?.firstName ?? ""} ${shopifyOrder.shippingAddress?.lastName ?? ""}`.trim();
	}

	const numericOrderId = extractShopifyOrderId(shopifyOrder.id);

	const items =
		shopifyOrder.lineItems?.edges?.reduce(
			(acc: number, li) => acc + (li.node?.quantity ?? 0),
			0,
		) ?? 0;

	let deliveryStatus = "";
	let tracking = "";
	let trackingReference = "";
	for (const f of shopifyOrder.fulfillments ?? []) {
		if (f?.displayStatus) deliveryStatus = f.displayStatus;
		for (const t of f?.trackingInfo ?? []) {
			if (t?.number) tracking = t.number;
			if (t?.company) trackingReference = t.company;
		}
		if (deliveryStatus && tracking && trackingReference) break;
	}

	return {
		orderId: numericOrderId,
		order: shopifyOrder.name ?? "",
		customer: customerName,
		shop: shop.name ?? "",
		shopId: shop._id?.toString() ?? "",
		date: shopifyOrder.createdAt ?? "",
		phone: shopifyOrder.shippingAddress?.phone ?? "",
		total: shopifyOrder.totalPriceSet?.shopMoney?.amount ?? "",
		items,
		status: shopifyOrder.displayFulfillmentStatus ?? "",
		wd_status: wdStatus,
		delivery_status: deliveryStatus,
		tracking,
		trackingReference,
		destination: shopifyOrder.shippingAddress
			? `${shopifyOrder.shippingAddress.address1 ?? ""}, ${shopifyOrder.shippingAddress.city ?? ""}, ${shopifyOrder.shippingAddress.country ?? ""}`.trim()
			: "",
		address2: shopifyOrder.shippingAddress?.address2 ?? "",
		zip: shopifyOrder.shippingAddress?.zip ?? "",
		note: shopifyOrder.note ?? "",
	};
}
