export type TShop = {
  _id?: string;
  name: string;
  phone?: string;
  logo_url: string;
  facebook?: string;
  instagram?: string;
  snapchat?: string;
  x?: string;
  youtube?: string;
  shopify_store_key: string;
  shopify_api_key: string;
  meta_ads_manager_id?: string | null;
  meta_business_manager_id?: string | null;
  meta_api_key?: string | null;
  expected_roas?: number | null;
  postex_api_key?: string | null;
  insta_api_key?: string | null;
  rocket_api_key?: string | null;
  blueex_api_key?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
};
export type TShopResponse = {
  shop: TShop;
};
export type TShopsResponse = {
  shops: TShop[];
};
export type TShopWithProductCount = TShop & {
  productCount: number;
};
export type TShopsWithProductCountResponse = {
  shops: TShopWithProductCount[];
};
