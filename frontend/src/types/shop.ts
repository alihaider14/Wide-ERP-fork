import type { ChangeEvent } from "react";

export type Shop = {
  _id: string;
  name: string;
};

type ShopConnectionFormData = {
  shopify_store_key?: string;
  shopify_api_key?: string;
};

export type TShopConnectionProps = {
  data?: ShopConnectionFormData;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
};
