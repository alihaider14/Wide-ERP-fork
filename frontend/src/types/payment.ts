export interface PaymentListItem {
  _id: string;
  payment_no: number;
  vendor_id: string;
  vendor_name: string;
  paid_amount: number;
  current_balance: number;
  remaining_balance: number;
  paid_at: string;
  note: string;
  createdAt: string;
  updatedAt: string;
}

export type PaymentFormData = {
  vendor_id?: string;
  paid_amount?: number;
  paid_at?: string;
  note?: string;
  payment_no?: number;
};

export type PaymentLocationState = {
  payment?: PaymentListItem;
};

export type PaymentsQueryResult = {
  payments: PaymentListItem[];
  total_pages: number;
  total_rows: number;
  from: number;
  to: number;
};

export type PaymentDeleteTarget = {
  id: string;
  paymentNo: string;
  vendorName: string;
};
