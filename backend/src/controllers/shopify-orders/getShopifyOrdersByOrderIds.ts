import { Request, Response } from "express";
import { validateWithZod } from "~/utils/errorHandling";
import { getShopifyOrderByOrderIdSchema } from "~/validations/shopify.schema";
import {
	getShopDomainAndAccessToken,
	toShopifyOrderGid,
} from "~/helper/shopify.helper";
import { createShopifyGraphQLClient } from "~/helper/shopify-update-order.helper";
import { GET_SHOPIFY_ORDERS_BY_ORDER_IDS } from "~/constants/shopifyOrders";

export const getShopifyOrdersByOrderIds = async (
	req: Request,
	res: Response,
) => {
	try {
		const { shopId, orderIds } = await validateWithZod(
			getShopifyOrderByOrderIdSchema,
			req.query,
		);

		const { accessToken, domain } = await getShopDomainAndAccessToken(shopId);

		const graphqlClient = createShopifyGraphQLClient(domain, accessToken);

		const orders = await Promise.all(
			orderIds.map(async (orderId: string) => {
				const gid = toShopifyOrderGid(orderId);

				const response = await graphqlClient.query(
					GET_SHOPIFY_ORDERS_BY_ORDER_IDS,
					{ id: gid },
					"getShopifyOrdersByOrderIds",
				);

				if (response.errors?.length) {
					throw new Error(
						response.errors
							.map((e: { message: string }) => e.message)
							.join(", "),
					);
				}

				const order = response.data.order;

				if (!order) throw new Error(`Order not found for id: ${orderId}`);

				const lineItems = order.lineItems.edges
					.map((e: { node: unknown }) => e.node)
					.filter(
						(item: { currentQuantity: number }) => item.currentQuantity > 0,
					);

				const phoneNo = (order.shippingAddress?.phone ?? "").replace(
					/\s+/g,
					"",
				);
				const formattedPhoneNo = phoneNo.startsWith("+")
					? phoneNo.slice(1)
					: phoneNo;

				return {
					orderId: order.id,

					product: lineItems.map((node: any) => ({
						image: node.image?.originalSrc ?? "",
						name: node.title || node.sku,
						price: Number(
							node.originalUnitPriceSet?.shopMoney?.amount || 0,
						).toString(),
						qty: Number(node.currentQuantity || 0),
						sku: node.sku ?? node.title,
						variantGid: node?.variant?.id || "",
					})),

					status: order.wd_status?.value || "Pending",
					discount: Number(
						order.currentTotalDiscountsSet?.shopMoney?.amount || 0,
					).toString(),
					deliveryCharges: Number(
						order.currentShippingPriceSet?.shopMoney?.amount || 0,
					).toString(),
					totalAmount: Number(
						order.currentTotalPriceSet?.shopMoney?.amount || 0,
					).toString(),

					customerName: [
						order.shippingAddress?.firstName ?? "",
						order.shippingAddress?.lastName ?? "",
					]
						.join(" ")
						.trim(),

					phoneNo: formattedPhoneNo,
					address: order.shippingAddress?.address1 ?? "",
					apartmentSuit: order.shippingAddress?.address2 ?? "",
					postalCode: order.shippingAddress?.zip ?? "",
					city: order.shippingAddress?.city ?? "",
					country: order.shippingAddress?.country ?? "",
					note: order.note ?? "",
					shippingRemarks: order.wd_shipper_remarks?.value || "",
				};
			}),
		);

		return res.status(200).json({ orders });
	} catch (error) {
		console.error("Error fetching Shopify orders by IDs:", error);
		return res.status(500).json({
			success: false,
			message: "Internal Server Error",
			error: error,
		});
	}
};
