import {
	GET_ORDER_STATUS_QUERY,
	ORDER_CANCEL_MUTATION,
	ORDER_DELETE_MUTATION,
} from "~/constants/shopifyOrders";
import {
	DeleteShopifyOrderOptions,
	OrderCancelReason,
	TGraphQLClient,
	TShopifyUserError,
} from "~/types/shopify";
import { assertNoUserErrors } from "./shopify-update-order.helper";

const isOrderAlreadyCancelled = async (
	orderId: string,
	client: TGraphQLClient,
): Promise<boolean> => {
	const { data } = await client.query(
		GET_ORDER_STATUS_QUERY,
		{
			id: orderId,
		},
		"isOrderAlreadyCancelled",
	);

	return !!data?.order?.cancelledAt;
};

const cancelShopifyOrder = async (
	orderId: string,
	client: TGraphQLClient,
	reason: OrderCancelReason,
	restock: boolean,
): Promise<void> => {
	const { data } = await client.query<{
		data: {
			orderCancel: {
				job: {
					id: string;
					done: boolean;
				};
				orderCancelUserErrors: TShopifyUserError[];
			};
		};
	}>(
		ORDER_CANCEL_MUTATION,
		{
			orderId,
			reason,
			refund: false,
			restock,
		},

		"cancelShopifyOrder",
	);

	assertNoUserErrors(
		data?.orderCancel?.orderCancelUserErrors,
		`cancelShopifyOrder`,
	);
};

const deleteShopifyOrder = async (
	orderId: string,
	client: TGraphQLClient,
): Promise<string> => {
	const { data } = await client.query<{
		data: {
			orderDelete: {
				deletedId: string;
				userErrors: TShopifyUserError[];
			};
		};
	}>(ORDER_DELETE_MUTATION, { orderId }, "deleteShopifyOrder");

	assertNoUserErrors(data?.orderDelete?.userErrors, `deleteShopifyOrder`);

	return data?.orderDelete?.deletedId;
};

export const cancelAndDeleteShopifyOrder = async ({
	orderId,
	client,
	cancelReason = "OTHER",
	restockOnCancel = true,
}: DeleteShopifyOrderOptions): Promise<{ deletedId: string }> => {
	const alreadyCancelled = await isOrderAlreadyCancelled(orderId, client);

	if (!alreadyCancelled)
		await cancelShopifyOrder(orderId, client, cancelReason, restockOnCancel);

	const deletedId = await deleteShopifyOrder(orderId, client);

	return { deletedId };
};
