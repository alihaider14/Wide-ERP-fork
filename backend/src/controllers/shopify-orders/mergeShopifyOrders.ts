import { Request, Response } from "express";
import {
	createShopifyGraphQLClient,
	replaceLineItemsWithEdit,
	updateOrderMetadata,
	validateShopifyProductStock,
} from "~/helper/shopify-update-order.helper";
import { TMergeShopifyOrdersPayload } from "~/types/shopify";
import {
	getShopDomainAndAccessToken,
	toShopifyOrderGid,
	updateShopifyOrderShipperRemarks,
	updateShopifyOrderWdStatus,
} from "~/helper/shopify.helper";
import { validateWithZod } from "~/utils/errorHandling";
import { mergeShopifyOrdersSchema } from "~/validations/shopify.schema";
import { cancelAndDeleteShopifyOrder } from "~/helper/shopify-delete-order";

export const mergeShopifyOrders = async (
	req: Request,
	res: Response,
): Promise<Response> => {
	try {
		const payload = await validateWithZod(mergeShopifyOrdersSchema, req.body);

		const {
			deletedOrderId,
			mergedOrderId,
			shopId,
			metadata,
			editSession,
			status,
			shippingRemarks,
		} = payload as TMergeShopifyOrdersPayload;

		const { accessToken, domain } = await getShopDomainAndAccessToken(shopId);

		const mergedOrderGid = toShopifyOrderGid(mergedOrderId);
		const deletedOrderGid = toShopifyOrderGid(deletedOrderId);

		const graphqlClient = createShopifyGraphQLClient(domain, accessToken);

		if (editSession) {
			await validateShopifyProductStock(editSession.product, graphqlClient);
			await replaceLineItemsWithEdit({
				gid: mergedOrderGid,
				client: graphqlClient,
				shopifyProducts: editSession.product,
				deliveryCharges: Number(editSession.deliveryCharges || 0),
				globalDiscount: editSession.discount,
			});
		}

		const parallelTasks: Promise<unknown>[] = [];

		if (metadata) {
			parallelTasks.push(
				updateOrderMetadata({
					gid: mergedOrderGid,
					client: graphqlClient,
					payload: metadata,
				}),
			);
		}

		if (status) {
			parallelTasks.push(
				updateShopifyOrderWdStatus({
					shopId,
					orderId: mergedOrderId,
					wd_status: status,
				}),
			);
		}

		if (shippingRemarks) {
			parallelTasks.push(
				updateShopifyOrderShipperRemarks({
					accessToken,
					domain,
					gid: mergedOrderGid,
					wd_shipper_remarks: shippingRemarks,
				}),
			);
		}

		if (parallelTasks.length > 0) await Promise.all(parallelTasks);

		await cancelAndDeleteShopifyOrder({
			orderId: deletedOrderGid,
			client: graphqlClient,
			cancelReason: "OTHER",
			restockOnCancel: false,
		});

		return res.status(200).json({
			message: "Orders merged successfully",
		});
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Internal Server Error";

		console.error("[mergeShopifyOrders] Error:", error);

		return res.status(500).json({ error: message });
	}
};
