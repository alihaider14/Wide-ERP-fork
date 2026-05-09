export interface IPaymentResponse {
  _id: string;
  payment_no: number;
  vendor_id: string;
  vendor_name?: string;
  paid_amount: number;
  current_balance: number;
  remaining_balance: number;
  paid_at: Date;
  note?: string;
  createdAt: Date;
  updatedAt: Date;
}
