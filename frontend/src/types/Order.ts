import { TUser } from './User';

export type TOrder = {
  _id: string;
  order_number: number;
  customer_name: string;
  customer_phone: string;
  sub_total_amount: number;
  discount: string;
  total_amount: number;
  items_count: number;
  items?: TOrderItems[];
  recieved_amount: number;
  created_by: Partial<TUser> | string;
  status: 'completed' | 'cancelled' | 'drafted';
  createdAt: Date;
  updatedAt: Date;
  user_id: string;
};

export type TOrdersPrompt = {
  data: Partial<TOrder>;
  open: boolean;
};

export type TOrderLogsHistoryResponse = {
  order_logs_history: string[];
};

export type TOrderItems = {
  _id?: string;
  order_id?: string;
  product_id: string;
  price: number;
  total_price?: number;
  sku?: string;
  quantity: number;
  product_qty?: number;
  createdAt?: Date;
  updatedAt?: Date;
  original_price?: number;
};

export type TGetOrderResponse = {
  total_pages: number;
  total_rows: number;
  from: number;
  to: number;
  today_sales: number;
  orders: TOrder[];
};

export type TAddAndUpdateOrderResponse = {
  order: TOrder;
};

export type TOrderItemByIdResponse = {
  order_items: TOrderItems[];
};

export type TOrderByIdResponse = {
  order: TOrder;
};

export type TBarcodeReaderProps = {
  onAddToCart: (product: TOrderItems) => void;
};
