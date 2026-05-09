import mongoose, { Schema, Document } from 'mongoose';

export interface IPayment extends Document {
  payment_no: number;
  vendor_id: mongoose.Types.ObjectId;
  paid_amount: number;
  current_balance: number;
  remaining_balance: number;
  paid_at: Date;
  note?: string;
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema: Schema = new Schema(
  {
    payment_no: {
      type: Number,
      required: true,
      unique: true,
    },
    vendor_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vendor',
      required: true,
    },
    paid_amount: {
      type: Number,
      required: true,
    },
    current_balance: {
      type: Number,
      required: true,
    },
    remaining_balance: {
      type: Number,
      required: true,
    },
    paid_at: {
      type: Date,
      required: true,
    },
    note: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IPayment>('Payment', paymentSchema);
