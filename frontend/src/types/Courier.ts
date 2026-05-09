import type { ShopifyRow } from "./shopify";

export type TCourier = {
  name: string;
  shop: string;
  address_code?:string
  api_key: string;
  pickup_address: string;
  return_address: string;
  status: 'Active' | 'Disabled';
};

export type TBookingRow = {
  id: string;
  rowKey: string;
  order: string;
  items:number;
  name: string;
  phone: string;
  address: string;
  city: string;
  cod: string;
  kg: string;
  type: string;
  selected: boolean;
  remarks: string;
  originalOrder: ShopifyRow;
};

export type TCourierRow = TCourier & {
  _id: string;
  updatedAt?: string;
};

export type TCourierPromptState = {
  open: boolean;
  data?: TCourierRow;
};

export interface CityOption {
  id: string;
  name: string;
}

export interface TCourierBasic {
  _id: string;
  name: string;
}