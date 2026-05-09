export type TShop = {
  website_url: string | undefined;
  logo: string;
  key: string;
  metaAds: string;
  social: string[];
  socialLinks: string[];
  status: string;
  website: string | undefined;
  _id?: string;
  name: string;
  phone: string;
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
  expected_roas?: number;
  // Removed courier API keys
  created_at?: Date;
  updated_at?: Date;
};
export type TGetShopsResponse = {
  total_pages: number;
  total_rows: number;
  from: number;
  to: number;
  shops: TShop[];
};
export type TAddAndUpdateShopResponse = {
  shop: TShop;
};
