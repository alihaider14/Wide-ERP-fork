import { Request, Response } from "express";
import { createShopifyGraphQLClient } from "../../helper/shopify-update-order.helper";
import { getShopDomainAndAccessToken } from "~/helper/shopify.helper";
import { GET_SHOPIFY_PRODUCTS_QUERY } from "~/constants/shopifyOrders";
import { TShopifyProduct } from "~/types/shopify";
import { getShopifyProductsSchema } from "~/validations/shopify.schema";
import { validateWithZod } from "~/utils/errorHandling";

export const getShopifyProductByShopId = async (
	req: Request,
	res: Response,
): Promise<Response> => {
	try {
		const validatedData = await validateWithZod(
			getShopifyProductsSchema,
			req.query,
		);

		const { size = 10, q, shopId, cursor } = validatedData;

		if (!shopId) throw new Error("Shop Id is required.");

		const { accessToken, domain } = await getShopDomainAndAccessToken(shopId);
		const graphqlClient = createShopifyGraphQLClient(domain, accessToken);

		const searchQuery = q ? `title:*${q}* OR sku:*${q}*` : "";

		const response = await graphqlClient.query(
			GET_SHOPIFY_PRODUCTS_QUERY,
			{
				search: searchQuery,
				first: size,
				after: cursor || null,
			},
			"getShopifyProductByShopId",
		);

		const productsData = response?.data?.products;

		const products: TShopifyProduct[] =
			productsData?.edges.flatMap((productEdge: any) => {
				const product = productEdge.node;

				return product.variants.edges
					.filter(
						(variantEdge: any) =>
							variantEdge.node.inventoryQuantity > 0 &&
							!!variantEdge.node.availableForSale,
					)
					.map((variantEdge: any) => ({
						name: product.title,
						image: product.images.edges[0]?.node?.url || "",
						price: Number(variantEdge.node.price || 0)?.toString(),
						qty: Number(variantEdge.node.inventoryQuantity || 0),
						sku: variantEdge.node.sku,
						variantGid: variantEdge.node.id,
					}));
			}) || [];

		const pageInfo = productsData?.pageInfo;

		return res.status(200).json({
			products,
			pageInfo,
		});
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Internal Server Error";

		console.error("[getShopifyProductByShopId] Error:", error);

		return res.status(500).json({
			error: message,
		});
	}
};
