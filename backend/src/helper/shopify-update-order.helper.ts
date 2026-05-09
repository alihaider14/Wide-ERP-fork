import axios, { AxiosInstance } from "axios";
import {
	TGraphQLClient,
	TShopifyUserError,
	TUpdateShopifyOrder,
	TShopifyProduct,
	TCalculatedLineItem,
	TLineItemToProcess,
	LINE_ITEM_DISCOUNT_DESCRIPTION,
} from "~/types/shopify";
import { parseDiscountAmount, toCurrency } from "./number-formator";
import { splitFullName } from "./shopify.helper";
import { GET_VARIANTS_STOCK } from "~/constants/shopifyOrders";

export const assertNoUserErrors = (
	errors: TShopifyUserError[] | undefined,
	context: string,
): void => {
	if (errors?.length) {
		throw new Error(`[${context}] ${errors.map((e) => e.message).join(", ")}`);
	}
};

export const createShopifyGraphQLClient = (
	domain: string,
	accessToken: string,
): TGraphQLClient => {
	const axiosInstance: AxiosInstance = axios.create({
		baseURL: `https://${domain}/admin/api/2026-04/graphql.json`,
		headers: {
			"X-Shopify-Access-Token": accessToken,
			"Content-Type": "application/json",
		},
	});

	return {
		query: async <T>(
			query: string,
			variables?: Record<string, unknown>,
			context?: string,
		): Promise<T> => {
			const { data } = await axiosInstance.post("", { query, variables });

			assertNoUserErrors(data?.errors, `GraphQL request failed: ${context}`);
			return data;
		},
	};
};

export const updateOrderMetadata = async ({
	gid,
	client,
	payload,
}: {
	gid: string;
	client: TGraphQLClient;
	payload: Pick<
		Partial<TUpdateShopifyOrder>,
		| "customerName"
		| "note"
		| "address"
		| "apartmentSuit"
		| "city"
		| "country"
		| "postalCode"
		| "phoneNo"
	>;
}): Promise<void> => {
	const { firstName, lastName } = splitFullName(payload.customerName ?? "");

	const response = await client.query<{
		data: {
			orderUpdate: {
				order: { id: string };
				userErrors: TShopifyUserError[];
			};
		};
	}>(
		`
      mutation OrderUpdate($input: OrderInput!) {
        orderUpdate(input: $input) {
          order { id }
          userErrors { field message }
        }
      }
    `,
		{
			input: {
				id: gid,
				note: payload.note ?? "",
				shippingAddress: {
					firstName,
					lastName,
					address1: payload.address,
					address2: payload.apartmentSuit ?? "",
					city: payload.city,
					country: payload.country,
					zip: payload.postalCode ?? "",
					phone: payload.phoneNo,
				},
			},
		},
		"updateOrderMetadata",
	);

	assertNoUserErrors(response.data?.orderUpdate?.userErrors, "orderUpdate");
};

export const validateShopifyProductStock = async (
	items: Omit<TShopifyProduct, "image">[],
	graphqlClient: TGraphQLClient,
): Promise<void> => {
	const variantIds = items.map((item) => item.variantGid).filter(Boolean);

	if (!variantIds.length) {
		throw new Error("No variant IDs provided");
	}

	const response = await graphqlClient.query(
		GET_VARIANTS_STOCK,
		{
			ids: variantIds,
		},
		"validateShopifyProductStock",
	);

	const variants = response?.data?.nodes || [];

	items.forEach((item) => {
		const variant = variants.find((v: any) => v?.id === item.variantGid);

		if (!variant) {
			throw new Error(`Variant ID not found for SKU ${item.sku}`);
		}

		const availableQty = Number(variant.inventoryQuantity || 0);
		const requestedQty = Number(item.qty || 0);
		const availablePrice = Number(variant.price || 0);
		const requestedPrice = Number(item.price || 0);

		if (requestedPrice > availablePrice) {
			throw new Error(
				`${item.sku} price cant be increased more than ${availablePrice} `,
			);
		}

		if (availableQty <= 0) {
			throw new Error(`Product ${item.sku} is out of stock`);
		}

		if (requestedQty > availableQty) {
			throw new Error(
				`Insufficient stock for product ${item.sku}. Requested: ${requestedQty}, Available: ${availableQty}`,
			);
		}
	});
};

export const reconcileLineItemDiscount = async ({
	client,
	calculatedOrderId,
	lineItemId,
	newAmount,
	qty,
	currencyCode,
	existingDiscount,
}: {
	client: TGraphQLClient;
	calculatedOrderId: string;
	lineItemId: string;
	newAmount: number;
	qty: number;
	currencyCode: string;
	existingDiscount:
		| { id: string; amount: number; existingQty: number }
		| undefined;
}): Promise<void> => {
	const hasExisting = existingDiscount !== undefined;
	const perUnitAmount = toCurrency(newAmount / qty);

	const existingPerUnit = hasExisting
		? toCurrency(existingDiscount.amount / existingDiscount.existingQty)
		: 0;
	const amountChanged = hasExisting && existingPerUnit !== perUnitAmount;

	// Shopify FIXED_AMOUNT = per-unit. Always pass total / qty.

	if (!hasExisting && newAmount <= 0) return;

	if (hasExisting && newAmount <= 0) {
		// Remove — no discount needed anymore
		const res = await client.query<{
			data: {
				orderEditRemoveDiscount: {
					userErrors: TShopifyUserError[];
				};
			};
		}>(
			`
      mutation OrderEditRemoveLineItemDiscount($id: ID!, $discountApplicationId: ID!) {
        orderEditRemoveDiscount(
          id: $id
          discountApplicationId: $discountApplicationId
        ) {
          userErrors { field message }
        }
      }
    `,
			{
				id: calculatedOrderId,
				discountApplicationId: existingDiscount.id,
			},
			"orderEditRemoveDiscount",
		);

		assertNoUserErrors(
			res.data?.orderEditRemoveDiscount?.userErrors,
			`orderEditRemoveDiscount(${lineItemId})`,
		);
		return;
	}

	if (hasExisting && !amountChanged) return;

	if (hasExisting && amountChanged) {
		// Update — total changed, update in place
		const res = await client.query<{
			data: {
				orderEditUpdateDiscount: {
					userErrors: TShopifyUserError[];
				};
			};
		}>(
			`
      mutation OrderEditUpdateDiscount(
        $id: ID!
        $discountApplicationId: ID!
        $discount: OrderEditAppliedDiscountInput!
      ) {
        orderEditUpdateDiscount(
          id: $id
          discountApplicationId: $discountApplicationId
          discount: $discount
        ) {
          userErrors { field message }
        }
      }
    `,
			{
				id: calculatedOrderId,
				discountApplicationId: existingDiscount.id,
				discount: {
					description: LINE_ITEM_DISCOUNT_DESCRIPTION,
					fixedValue: {
						amount: perUnitAmount.toFixed(2),
						currencyCode,
					},
				},
			},
			"orderEditUpdateDiscount",
		);

		assertNoUserErrors(
			res.data?.orderEditUpdateDiscount?.userErrors,
			`orderEditUpdateDiscount(${lineItemId})`,
		);
		return;
	}

	// Add — no existing discount, new total > 0
	const res = await client.query<{
		data: {
			orderEditAddLineItemDiscount: {
				calculatedOrder: { id: string };
				userErrors: TShopifyUserError[];
			};
		};
	}>(
		`
    mutation OrderEditAddLineItemDiscount(
      $id: ID!
      $lineItemId: ID!
      $discount: OrderEditAppliedDiscountInput!
    ) {
      orderEditAddLineItemDiscount(
        id: $id
        lineItemId: $lineItemId
        discount: $discount
      ) {
        calculatedOrder { id }
        userErrors { field message }
      }
    }
  `,
		{
			id: calculatedOrderId,
			lineItemId,
			discount: {
				description: LINE_ITEM_DISCOUNT_DESCRIPTION,
				fixedValue: {
					amount: perUnitAmount.toFixed(2),
					currencyCode,
				},
			},
		},
		"orderEditAddLineItemDiscount",
	);

	assertNoUserErrors(
		res.data?.orderEditAddLineItemDiscount?.userErrors,
		`orderEditAddLineItemDiscount(${lineItemId})`,
	);
};

export const replaceLineItemsWithEdit = async ({
	gid,
	client,
	shopifyProducts,
	deliveryCharges,
	globalDiscount = "0",
}: {
	gid: string;
	client: TGraphQLClient;
	shopifyProducts: Omit<TShopifyProduct, "image">[];
	deliveryCharges?: number;
	globalDiscount?: string;
}): Promise<void> => {
	// ── a. Begin Edit ────────────────────────────────────────────────────────

	const beginRes = await client.query<{
		data: {
			orderEditBegin: {
				calculatedOrder: { id: string };
				userErrors: TShopifyUserError[];
			};
		};
	}>(
		`
    mutation OrderEditBegin($id: ID!) {
      orderEditBegin(id: $id) {
        calculatedOrder { id }
        userErrors { field message }
      }
    }
  `,
		{ id: gid },
	);

	assertNoUserErrors(
		beginRes.data?.orderEditBegin?.userErrors,
		"orderEditBegin",
	);

	const calculatedOrderId = beginRes.data.orderEditBegin.calculatedOrder.id;

	// ── b. Fetch Calculated Line Items + Existing Discount ───────────────────

	const calcOrderRes = await client.query<{
		data: {
			node: {
				lineItems: {
					edges: { node: TCalculatedLineItem }[];
				};
				shippingLines: {
					id: string;
					stagedStatus: string;
					title: string;
					price: {
						shopMoney: {
							amount: string;
							currencyCode: string;
						};
					};
				}[];
			};
		};
	}>(
		`
    query FetchCalculatedOrder($id: ID!) {
      node(id: $id) {
        ... on CalculatedOrder {
		shippingLines {
		id
		stagedStatus
		title
		price {
			shopMoney {
				amount
				currencyCode
			}
		}
		}
        lineItems(first: 50) {
            edges {
              node {
                id
                quantity
                variant { id }
                calculatedDiscountAllocations {
                  discountApplication {
                    id
                    description
                    value {
                      ... on MoneyV2 { amount }
                      ... on PricingPercentageValue { percentage }
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
		{ id: calculatedOrderId },
		"FetchCalculatedOrder",
	);

	const allCalculatedItems: TCalculatedLineItem[] =
		calcOrderRes.data?.node?.lineItems?.edges?.map((e) => e.node) ?? [];

	const activeCalculatedItems = allCalculatedItems.filter(
		(item) => item.quantity > 0,
	);

	// variantGid -> calculatedLineItemId
	const existingVariantMap = new Map<string, string>();
	// variantGid -> existing combined discount { id, amount }
	const existingDiscountMap = new Map<
		string,
		{ id: string; amount: number; existingQty: number }
	>();

	for (const item of activeCalculatedItems) {
		if (!item.variant?.id) continue;
		existingVariantMap.set(item.variant.id, item.id);

		const allocation = item.calculatedDiscountAllocations.find(
			(a) =>
				a.discountApplication.description === LINE_ITEM_DISCOUNT_DESCRIPTION,
		);
		if (allocation) {
			const amount = parseFloat(
				(allocation.discountApplication.value as { amount?: string }).amount ??
					"0",
			);
			existingDiscountMap.set(item.variant.id, {
				id: allocation.discountApplication.id,
				amount,
				existingQty: item.quantity,
			});
		}
	}

	const payloadVariantGids = new Set(shopifyProducts.map((p) => p.variantGid));

	// ── c. Case B — Zero out variants not in payload ─────────────────────────

	for (const item of activeCalculatedItems) {
		const variantGid = item.variant?.id;
		if (!variantGid || payloadVariantGids.has(variantGid)) continue;

		const removeRes = await client.query<{
			data: {
				orderEditSetQuantity: {
					calculatedOrder: { id: string };
					userErrors: TShopifyUserError[];
				};
			};
		}>(
			`
      mutation OrderEditSetQuantity($id: ID!, $lineItemId: ID!, $quantity: Int!) {
        orderEditSetQuantity(id: $id, lineItemId: $lineItemId, quantity: $quantity) {
          calculatedOrder { id }
          userErrors { field message }
        }
      }
    `,
			{ id: calculatedOrderId, lineItemId: item.id, quantity: 0 },
			"orderEditSetQuantity remove",
		);

		assertNoUserErrors(
			removeRes.data?.orderEditSetQuantity?.userErrors,
			`orderEditSetQuantity remove(${variantGid})`,
		);
	}

	// ── d. Case A + C — Update or add variants ───────────────────────────────

	const itemsToReconcile: TLineItemToProcess[] = [];

	for (const item of shopifyProducts) {
		const existingCalculatedLineItemId = existingVariantMap.get(
			item.variantGid,
		);
		const existingDiscount = existingDiscountMap.get(item.variantGid);

		if (existingCalculatedLineItemId) {
			// Case A: variant already on order — update quantity in place
			const updateRes = await client.query<{
				data: {
					orderEditSetQuantity: {
						calculatedLineItem: {
							id: string;
							originalUnitPriceSet: {
								shopMoney: { amount: string; currencyCode: string };
							};
						};
						userErrors: TShopifyUserError[];
					};
				};
			}>(
				`
        mutation OrderEditSetQuantity($id: ID!, $lineItemId: ID!, $quantity: Int!) {
          orderEditSetQuantity(id: $id, lineItemId: $lineItemId, quantity: $quantity) {
            calculatedLineItem {
              id
              originalUnitPriceSet { shopMoney { amount currencyCode } }
            }
            userErrors { field message }
          }
        }
      `,
				{
					id: calculatedOrderId,
					lineItemId: existingCalculatedLineItemId,
					quantity: item.qty,
				},
				"orderEditSetQuantity update",
			);

			assertNoUserErrors(
				updateRes.data?.orderEditSetQuantity?.userErrors,
				`orderEditSetQuantity update(${item.variantGid})`,
			);

			const shopMoney =
				updateRes.data.orderEditSetQuantity.calculatedLineItem
					.originalUnitPriceSet.shopMoney;

			itemsToReconcile.push({
				calculatedLineItemId: existingCalculatedLineItemId,
				shopifyUnitPrice: parseFloat(shopMoney.amount),
				editedPrice: Number(item.price || 0),
				qty: item.qty,
				currencyCode: shopMoney.currencyCode,
				existingDiscount,
			});
		} else {
			// Case C: new variant — add fresh
			const addRes = await client.query<{
				data: {
					orderEditAddVariant: {
						calculatedLineItem: {
							id: string;
							originalUnitPriceSet: {
								shopMoney: { amount: string; currencyCode: string };
							};
						};
						userErrors: TShopifyUserError[];
					};
				};
			}>(
				`
        mutation OrderEditAddVariant($id: ID!, $variantId: ID!, $quantity: Int!) {
          orderEditAddVariant(id: $id, variantId: $variantId, quantity: $quantity) {
            calculatedLineItem {
              id
              originalUnitPriceSet { shopMoney { amount currencyCode } }
            }
            userErrors { field message }
          }
        }
      `,
				{
					id: calculatedOrderId,
					variantId: item.variantGid,
					quantity: item.qty,
				},
				"orderEditAddVariant",
			);

			assertNoUserErrors(
				addRes.data?.orderEditAddVariant?.userErrors,
				`orderEditAddVariant(${item.variantGid})`,
			);

			const shopMoney =
				addRes.data.orderEditAddVariant.calculatedLineItem.originalUnitPriceSet
					.shopMoney;

			itemsToReconcile.push({
				calculatedLineItemId:
					addRes.data.orderEditAddVariant.calculatedLineItem.id,
				shopifyUnitPrice: parseFloat(shopMoney.amount),
				editedPrice: Number(item.price || 0),
				qty: item.qty,
				currencyCode: shopMoney.currencyCode,
				existingDiscount,
			});
		}
	}

	// ── e. Reconcile Single Combined Discount Per Line Item ──────────────────
	//
	// combinedDiscount = priceAdjustmentAmount + proportionalOrderDiscount
	//
	// One reconcileLineItemDiscount call per item = one Shopify mutation.
	// This avoids the silent replacement bug where the second
	// orderEditAddLineItemDiscount would overwrite the first.

	const totalSubtotal = itemsToReconcile.reduce(
		(sum, i) => sum + toCurrency(i.editedPrice * i.qty),
		0,
	);
	const totalGlobalDiscountAmount = parseDiscountAmount(
		globalDiscount,
		totalSubtotal,
	);

	for (const item of itemsToReconcile) {
		const itemSubtotal = toCurrency(item.editedPrice * item.qty);

		const priceAdjustmentAmount = toCurrency(
			(item.shopifyUnitPrice - item.editedPrice) * item.qty,
		);

		const proportionalOrderDiscount =
			totalSubtotal > 0 && totalGlobalDiscountAmount > 0
				? toCurrency((itemSubtotal / totalSubtotal) * totalGlobalDiscountAmount)
				: 0;

		const combinedDiscount = toCurrency(
			Math.max(0, priceAdjustmentAmount) + proportionalOrderDiscount,
		);

		await reconcileLineItemDiscount({
			client,
			calculatedOrderId,
			lineItemId: item.calculatedLineItemId,
			newAmount: combinedDiscount,
			qty: item.qty,
			currencyCode: item.currencyCode,
			existingDiscount: item.existingDiscount,
		});
	}

	// ── f. Add or remove Shipping Line ─────────────────────────────────────────────────

	const existingShippingLines = calcOrderRes.data?.node?.shippingLines ?? [];
	const existingShippingLineCurrencyCode =
		calcOrderRes.data?.node?.shippingLines?.[0]?.price?.shopMoney?.currencyCode;

	for (const shippingLine of existingShippingLines) {
		const removeShippingLineRes = await client.query<{
			data: {
				orderEditRemoveShippingLine: {
					calculatedOrder: { id: string };
					userErrors: TShopifyUserError[];
				};
			};
		}>(
			`
    mutation removeShippingLine($id: ID!, $shippingLineId: ID!) {
      orderEditRemoveShippingLine(id: $id, shippingLineId: $shippingLineId) {
        calculatedOrder { id }
        userErrors { field message }
      }
    }
    `,
			{
				id: calculatedOrderId,
				shippingLineId: shippingLine.id,
			},
			"orderEditRemoveShippingLine",
		);

		assertNoUserErrors(
			removeShippingLineRes.data?.orderEditRemoveShippingLine?.userErrors,
			`orderEditRemoveShippingLine(${shippingLine.id})`,
		);
	}

	if (deliveryCharges && deliveryCharges > 0) {
		const shippingRes = await client.query<{
			data: {
				orderEditAddShippingLine: {
					calculatedOrder: { id: string };
					userErrors: TShopifyUserError[];
				};
			};
		}>(
			`
      mutation OrderEditAddShippingLine($id: ID!, $input: OrderEditAddShippingLineInput!) {
        orderEditAddShippingLine(id: $id, shippingLine: $input) {
          calculatedOrder { id }
          userErrors { field message }
        }
      }
    `,
			{
				id: calculatedOrderId,
				input: {
					title: "Standard Shipping added from Wide ERP",
					price: {
						amount: toCurrency(deliveryCharges).toFixed(2),
						currencyCode: existingShippingLineCurrencyCode || "PKR",
					},
				},
			},
			"orderEditAddShippingLine",
		);

		assertNoUserErrors(
			shippingRes.data?.orderEditAddShippingLine?.userErrors,
			"orderEditAddShippingLine",
		);
	}

	// ── g. Commit ────────────────────────────────────────────────────────────

	const commitRes = await client.query<{
		data: {
			orderEditCommit: {
				order: { id: string };
				userErrors: TShopifyUserError[];
			};
		};
	}>(
		`
    mutation OrderEditCommit($id: ID!) {
      orderEditCommit(id: $id, notifyCustomer: false, staffNote: "Updated via WD") {
        order { id }
        userErrors { field message }
      }
    }
  `,
		{ id: calculatedOrderId },
		"orderEditCommit",
	);

	assertNoUserErrors(
		commitRes.data?.orderEditCommit?.userErrors,
		"orderEditCommit",
	);
};
