import mongoose, { Document, Schema } from 'mongoose';

export interface IBill extends Document {
  bill_no: number;
  vendor: mongoose.Types.ObjectId;
  amount: number;
  items: number;
  bill_date: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const billSchema = new Schema<IBill>(
  {
    bill_no: { type: Number, required: true, unique: true },
    vendor: { type: Schema.Types.ObjectId, ref: 'Vendor', required: true },
    amount: { type: Number, required: true },
    items: { type: Number, required: true },
    bill_date: { type: Date, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IBill>('Bill', billSchema);
