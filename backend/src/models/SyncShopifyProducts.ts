import mongoose, { Schema } from "mongoose";
import { ISyncShopifyProducts } from "~/types/sync-shopify-products";

const SyncShopifyProductsSchema = new Schema<ISyncShopifyProducts>({
  store_name: { type: String, required: true },
  cursor: { type: String, default: null },
  products_created_count: { type: Number, default: 0 },
}, { timestamps: true });

export const SyncShopifyProducts = mongoose.model<ISyncShopifyProducts>("SyncShopifyProducts", SyncShopifyProductsSchema);
