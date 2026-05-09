import { Request, Response } from "express";
import {
	createShopifyGraphQLClient,
	replaceLineItemsWithEdit,
	updateOrderMetadata,
	validateShopifyProductStock,
} from "../../helper/shopify-update-order.helper";
import { TUpdateShopifyOrderPayload } from "~/types/shopify";
import {
	getShopDomainAndAccessToken,
	toShopifyOrderGid,
	updateShopifyOrderShipperRemarks,
	updateShopifyOrderWdStatus,
} from "~/helper/shopify.helper";
import { validateWithZod } from "~/utils/errorHandling";
import { updateShopifyOrderSchema } from "~/validations/shopify.schema";

export const updateShopifyOrder = async (
	req: Request,
	res: Response,
): Promise<Response> => {
	try {
		const payload = await validateWithZod(updateShopifyOrderSchema, req.body);

		const { orderId, shopId, metadata, editSession, status, shippingRemarks } =
			payload as TUpdateShopifyOrderPayload;

		const { accessToken, domain } = await getShopDomainAndAccessToken(shopId);
		const gid = toShopifyOrderGid(orderId);

		const graphqlClient = createShopifyGraphQLClient(domain, accessToken);

		if (editSession)
			await validateShopifyProductStock(editSession.product, graphqlClient);

		const parallelTasks: Promise<unknown>[] = [];

		if (metadata) {
			parallelTasks.push(
				updateOrderMetadata({
					gid,
					client: graphqlClient,
					payload: metadata,
				}),
			);
		}

		if (status) {
			parallelTasks.push(
				updateShopifyOrderWdStatus({
					shopId,
					orderId,
					wd_status: status,
				}),
			);
		}

		if (shippingRemarks) {
			parallelTasks.push(
				updateShopifyOrderShipperRemarks({
					accessToken,
					domain,
					gid,
					wd_shipper_remarks: shippingRemarks,
				}),
			);
		}

		if (parallelTasks.length > 0) await Promise.all(parallelTasks);

		if (editSession)
			await replaceLineItemsWithEdit({
				gid,
				client: graphqlClient,
				shopifyProducts: editSession.product,
				deliveryCharges: Number(editSession.deliveryCharges || 0),
				globalDiscount: editSession.discount,
			});

		return res.status(200).json({
			message: "Order updated successfully",
		});
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Internal Server Error";

		console.error("[updateShopifyOrder] Error:", error);

		return res.status(500).json({
			error: message,
		});
	}
};
