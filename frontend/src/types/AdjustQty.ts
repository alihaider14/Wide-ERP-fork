import { TProduct } from './Products';
import { TUser } from './User';

export type TAdjustQty = {
  _id: string;
  product_id: string;
  cost: number;
  quantity: number;
  reason: string;
  remaining_qty: string;
  history_count: number;
  created_by: Partial<TUser> | string;
  createdAt: Date;
  updatedAt: Date;
};

export type TGetAdjustQtyResponse = {
  total_pages: number;
  total_rows: number;
  from: number;
  to: number;
  product_quantities: TAdjustQty[];
};

export type TAddAndUpdateAdjustQtyResponse = {
  product_qty: TAdjustQty;
};

export type TProductQtyByIdResponse = {
  product_qty: {
    _id: string;
    product_id: TProduct;
    cost: number;
    quantity: number;
    reason: string;
    remaining_qty: string;
    createdAt: Date;
    updatedAt: Date;
  };
};

export type TAdjustmentHistoryResponse = {
  adjustment_history: string[];
};

export type TImportAdjustQuantites = {
  sku: string;
} & Partial<TAdjustQty>;

export type TImportProductsQuantitiesResponse = {
  data: string[];
};
