import { Request, Response } from "express";
import axios from "axios";
import Shop from "../../models/shop";
import { decryptApiKey } from "~/utils/encryption";
import { TShop } from "~/types/shop";
import { ShopifyOrder, TPDFOrder, TPrintStoreInfo } from "~/types/shopify";
import Courier from "~/models/courier";
import {
	incrementShopifyOrderPrintedCount,
	toShopifyOrderGid,
} from "~/helper/shopify.helper";

export const printOrders = async (req: Request, res: Response) => {
	try {
		const orders: { shopId: string; orderId: string }[] = req.body;

		if (!Array.isArray(orders) || orders.length === 0) {
			return res.status(400).json({
				message: "A non-empty array of { shopId, orderId } is required.",
			});
		}

		// Group orderIds by shopId
		const byShop = orders.reduce<Record<string, string[]>>(
			(acc, { shopId, orderId }) => {
				if (!acc[shopId]) acc[shopId] = [];
				acc[shopId].push(orderId);
				return acc;
			},
			{},
		);

		const pdfOrders: TPDFOrder[] = [];

		for (const [shopId, orderIds] of Object.entries(byShop)) {
			const shop: TShop | null = await Shop.findById(shopId);
			const courier = await Courier.findOne({ shop: shopId });

			if (!shop) {
				console.warn(`Shop not found for id: ${shopId}`);
				continue;
			}

			const store: TPrintStoreInfo = {
				domain: shop.shopify_store_key,
				accessToken: decryptApiKey(shop.shopify_api_key),
				shopId: shop._id?.toString()!,
				shopName: shop.name,
				storeLogo: shop.logo_url,
				storeKey: shop.shopify_store_key,
			};

			const queries = orderIds.map((id) => {
				const gid = toShopifyOrderGid(id);

				return axios.post(
					`https://${store.domain}/admin/api/2023-07/graphql.json`,
					{
						query: `
              {
                order(id: "${gid}") {
                  id
                  name
                  createdAt
                  note
                  currentTotalPriceSet { shopMoney { amount currencyCode } }
                  currentSubtotalPriceSet { shopMoney { amount } }
                  currentShippingPriceSet { shopMoney { amount } }
                  currentTotalTaxSet { shopMoney { amount currencyCode } }
                  lineItems(first: 50) {
                    edges {
                      node {
                        title
                        sku
                        currentQuantity
                        image { originalSrc }
                        originalUnitPriceSet {
                          shopMoney { amount }
                        }
                      }
                    }
                  }
                  customer {
                    firstName
                    lastName
                    phone
                  }
                  shippingAddress {
                    firstName
                    lastName
                    address1
                    address2
                    city
                    province
                    country
                    phone
                  }
                  fulfillments {
                    trackingInfo {
                      number
                      company
                    }
                  }
                }
              }
            `,
					},
					{
						headers: {
							"X-Shopify-Access-Token": store.accessToken,
							"Content-Type": "application/json",
						},
					},
				);
			});

			const responses = await Promise.allSettled(queries);

			for (const result of responses) {
				if (result.status === "fulfilled" && result.value.data?.data?.order) {
					const order = result.value.data.data.order as ShopifyOrder;

					const trackingInfo = order.fulfillments?.[0]?.trackingInfo?.[0];
					const trackingId = trackingInfo?.number ?? "";
					const courierName = trackingInfo?.company ?? "";

					const products =
						order.lineItems?.edges?.map((edge) => {
							const price = parseFloat(
								edge.node.originalUnitPriceSet?.shopMoney?.amount ?? "0",
							);
							return {
								name: edge.node.title,
								sku: edge.node.sku ?? "",
								price,
								quantity: edge.node.currentQuantity,
								total: price * edge.node.currentQuantity,
								image: edge.node.image?.originalSrc,
							};
						}) ?? [];

					const subtotal = parseFloat(
						order.currentSubtotalPriceSet?.shopMoney?.amount ?? "0",
					);
					const shipping = parseFloat(
						order.currentShippingPriceSet?.shopMoney?.amount ?? "0",
					);
					const total = parseFloat(
						order.currentTotalPriceSet?.shopMoney?.amount ?? "0",
					);
					const gstAmount = parseFloat(
						order.currentTotalTaxSet?.shopMoney?.amount ?? "0",
					);

					const destination: string = order.shippingAddress
						? `${order.shippingAddress.address1 ?? ""}, ${
								order.shippingAddress.city ?? ""
							}, ${order.shippingAddress.country ?? ""}`.trim()
						: "";

					const orderDate = new Date(order.createdAt);
					const customerName =
						[
							order.shippingAddress?.firstName || order.customer?.firstName,
							order.shippingAddress?.lastName || order.customer?.lastName,
						]
							.filter(Boolean)
							.join(" ") || "";

					const pdfOrder: TPDFOrder = {
						shopId: store.shopId,
						storeName: store.shopName,
						storeLogo: store.storeLogo,
						shopifyStoreKey: store.storeKey,
						orderDate: `${orderDate
							.toLocaleDateString("en-US", {
								weekday: "short",
								month: "short",
								day: "numeric",
							})
							.replace(",", "")}, ${orderDate.getFullYear()}`,
						customerName,
						addressLine1: order.shippingAddress?.address1 ?? "",
						addressLine2: order.shippingAddress?.address2 ?? "",
						phone: order.customer?.phone ?? "",
						city: order.shippingAddress?.city ?? "",
						state: order.shippingAddress?.province ?? "",
						orderNumber: order.name ?? "",
						note: order.note ?? "",
						trackingId,
						products,
						subtotal,
						shipping,
						total,
						gstAmount,
						courierName,
						consigneeInformation: {
							name: customerName,
							contact:
								order.shippingAddress?.phone || order.customer?.phone || "",
							deliveryAddress: destination,
						},

						shipperInformation: {
							name: shop?.name,
							contact: shop?.phone ?? "",
							pickupAdress: courier?.pickup_address ?? "",
							returnAdress: courier?.return_address ?? "",
							details: "",
						},
						shipmentInformation: {
							pieces: products.length,
							orderRef: order.name ?? "",
							trackingNumber: trackingId,
							origin: "Karachi",
							destination: order.shippingAddress?.city ?? "",
							returnCity: "Karachi",
							remarks: "Must call the customer before parcel delivery.",
						},
						orderInformation: {
							orderType: "Normal",
							amount: total,
						},
					};

					pdfOrders.push(pdfOrder);
				} else if (result.status === "rejected") {
					console.error("Order fetch failed:", result.reason);
				}
			}
		}

		await incrementPrintedCountByShop({ byShop });

		return res.status(200).json({ orders: pdfOrders });
	} catch (error) {
		console.error("Error fetching Shopify orders by IDs:", error);
		return res.status(500).json({
			success: false,
			message: "Internal Server Error",
		});
	}
};

export async function incrementPrintedCountByShop({
	byShop,
}: {
	byShop: Record<string, string[]>;
}) {
	try {
		for (const [shopId, orderIds] of Object.entries(byShop)) {
			await Promise.allSettled(
				orderIds.map(async (orderId) => {
					try {
						await incrementShopifyOrderPrintedCount({
							shopId,
							orderId,
						});
					} catch (err) {
						console.error(
							`Failed increment shop=${shopId} order=${orderId}`,
							err,
						);
					}
				}),
			);
		}
	} catch (error) {
		console.error("Error incrementing printed count by shop:", error);
		throw error;
	}
}
