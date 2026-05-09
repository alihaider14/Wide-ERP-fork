import {Request, Response} from "express";
import axios from "axios";
import Shop from "../../models/shop";
import {decryptApiKey} from "~/utils/encryption";
import {updateOrderAddressSchema} from "~/validations/shopify-address.schema";
import {validateWithZod} from "~/utils/errorHandling";
import {parseShippingAddress} from "~/utils/address-parser";

export async function updateOrderAddress(req: Request, res: Response) {
  try {
    const {store_id, order_id, address} = await validateWithZod(
      updateOrderAddressSchema,
      req.body,
    );

    let shippingAddress;

    try {
      shippingAddress = parseShippingAddress(address);
    } catch (err) {
      return res.status(400).json({
        error: "Validation failed",
        details: {
          address: [err instanceof Error ? err.message : "Invalid address"],
        },
      });
    }
    const shop = await Shop.findById(store_id);
    if (!shop) {
      return res.status(404).json({error: "Shop not found"});
    }

    const shopifyAccessToken = decryptApiKey(shop.shopify_api_key);

    const response = await axios.put(
      `https://${shop.shopify_store_key}/admin/api/2024-01/orders/${order_id}.json`,
      {
        order: {
          id: order_id,
          shipping_address: shippingAddress,
        },
      },
      {
        headers: {
          "X-Shopify-Access-Token": shopifyAccessToken,
          "Content-Type": "application/json",
        },
      },
    );

    return res.json({success: true, shopifyOrder: response.data});
  } catch (error) {
    console.error("Error updating order address:", error);

    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      const data = error.response?.data;

      console.error("Shopify API error response:", {
        status,
        data,
      });

      if (data?.errors && typeof data.errors === "object") {
        return res.status(400).json({
          error: "Validation failed",
          details: data.errors,
        });
      }

      if (typeof data?.errors === "string") {
        return res.status(status).json({
          error: "Shopify API error",
          details: {general: [data.errors]},
        });
      }

      // Fallback: return whatever Shopify gave us normalized to "details"
      return res.status(status).json({
        error: "Shopify API error",
        details: data || {general: [error.message]},
      });
    }

    return res.status(500).json({
      error: "Server error",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
