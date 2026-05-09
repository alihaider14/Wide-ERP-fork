import { Types } from "mongoose";

export type TOrderInputItem = {
  product_id: string;
  price: number;
  original_price: number;
  quantity: number;
};

export type TOrderAllocation = {
  product_quantity_id: Types.ObjectId;
  allocated_quantity: number;
  allocated_cost: number;
};

export type TOrderItemWithAllocations = TOrderInputItem & {
  allocations: TOrderAllocation[];
  order_id?: Types.ObjectId | string;
};

export type TOrderStockCheckItem = {
  product_id: string;
  quantity: number;
  product_qty: number;
};

export type TOrderRestorableItem = {
  product_id: Types.ObjectId | string;
  allocations: TOrderAllocation[];
  quantity: number;
};
