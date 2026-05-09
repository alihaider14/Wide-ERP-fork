import mongoose, { Schema, Document } from 'mongoose';

export interface IVendor extends Document {
  full_name: string;
  email?: string;
  phone: string;
  address?: string;
  to_pay: number;
  opening_balance: number;
  createdAt: Date;
  updatedAt: Date;
}

const vendorSchema: Schema = new Schema(
  {
    full_name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: false,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
      default: '',
    },
    to_pay: {
      type: Number,
      required: true,
      default: 0,
    },
    opening_balance: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IVendor>('Vendor', vendorSchema);
