import { Request, Response } from "express";
import axios from "axios";
import Shop from "~/models/shop";
import { decryptApiKey } from "~/utils/encryption";
import { validateWithZod } from "~/utils/errorHandling";
import { salesAnalyticsSchema } from "~/validations/shopify.schema";
import { daysBetween } from "~/helper/time-formator";
import { SHOPIFY_SALES_QUERY } from "~/constants/shopifyOrders";

export async function getShopifySalesAnalytics(req: Request, res: Response) {
  try {
    const { store_id, startDate, endDate } = await validateWithZod(salesAnalyticsSchema, req.query);

    const shop = await Shop.findById(store_id, { shopify_store_key: 1, shopify_api_key: 1, name: 1 });
    if (!shop) {
      return res.status(404).json({ error: "Store not found" });
    }

    const domain = shop.shopify_store_key;
    if (!domain || typeof domain !== "string" || !domain.includes(".")) {
      return res.status(400).json({ error: "Store has no valid Shopify domain" });
    }

    const accessToken = decryptApiKey(shop.shopify_api_key);
    const query = `created_at:>=${startDate} AND created_at:<=${endDate}`;
    let hasNextPage = true;
    let cursor: string | null = null;
    let totalSales = 0;
    let totalOrders = 0;

    while (hasNextPage) {
      const variables: Record<string, unknown> = { query };
      if (cursor) variables.after = cursor;

      const { data } = await axios.post(
        `https://${domain}/admin/api/2023-07/graphql.json`,
        { query: SHOPIFY_SALES_QUERY, variables },
        {
          headers: {
            "X-Shopify-Access-Token": accessToken,
            "Content-Type": "application/json",
          },
          timeout: 30000,
        },
      );

      if (data?.errors) {
        return res.status(502).json({ error: data.errors[0]?.message || "GraphQL query failed" });
      }

      const ordersData = data?.data?.orders;
      if (!ordersData) break;

      for (const edge of ordersData.edges) {
        totalSales += parseFloat(edge.node.currentTotalPriceSet.shopMoney.amount || "0");
        totalOrders++;
      }

      hasNextPage = ordersData.pageInfo.hasNextPage;
      cursor = ordersData.pageInfo.endCursor;
    }

    const days = daysBetween(startDate, endDate);

    return res.json({
      shopId: store_id,
      shop: shop.name,
      sales: Math.round(totalSales * 100) / 100,
      avgSales: Math.round((totalSales / days) * 100) / 100,
      orders: totalOrders,
      avgOrders: Math.round((totalOrders / days) * 100) / 100,
    });
  } catch (err: unknown) {
    return res.status(500).json({
      error: err instanceof Error ? err.message : "Failed to fetch sales analytics",
    });
  }
}
