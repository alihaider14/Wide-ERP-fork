import mongoose, { Schema, Document } from 'mongoose';

export interface IBillItem extends Document {
  bill: mongoose.Types.ObjectId;
  product: mongoose.Types.ObjectId;
  price: number;
  qty: number;
  total_price: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const billItemSchema = new Schema<IBillItem>(
  {
    bill: { type: Schema.Types.ObjectId, ref: 'Bill', required: true },
    product: { type: Schema.Types.ObjectId, ref: 'products', required: true },
    price: { type: Number, required: true },
    qty: { type: Number, required: true },
    total_price: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IBillItem>('BillItem', billItemSchema);
