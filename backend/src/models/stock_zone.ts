import mongoose, { Schema, Document } from 'mongoose';

export interface IStockZone extends Document {
  name: string;
  products_count: number;
  total_quantity: number;
  createdAt: Date;
  updatedAt: Date;
}

const StockZoneSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    products_count: { type: Number, default: 0 },
    total_quantity: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<IStockZone>('StockZone', StockZoneSchema);