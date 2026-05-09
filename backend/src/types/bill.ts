import { Types } from "mongoose";

export type BillItemInput = {
  product: string;
  cost: number;
  qty: number;
  description?: string;
};

export type VendorView = {
  _id: Types.ObjectId | string;
  full_name: string;
};

export type ProductView = {
  _id: Types.ObjectId | string;
  sku?: string;
  barcode?: string;
};

export type ProductQtyRow = {
  product_id: Types.ObjectId | ProductView;
  cost: number;
  quantity: number;
  remaining_qty: number;
};
