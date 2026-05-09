import mongoose, {Schema, Document} from "mongoose";

export interface ICourier extends Document {
  name: string;
  address_code: string;
  shop: mongoose.Types.ObjectId;
  status: "Active" | "Disabled";
  api_key: string;
  pickup_address: string;
  return_address: string;
  createdAt: Date;
  updatedAt: Date;
}

const courierSchema: Schema = new Schema(
  {
    name: {type: String, required: true, enum: ["PostEx", "Insta", "Rocket"]},
    address_code: {
      type: String,
      required: false,
    },
    shop: {type: Schema.Types.ObjectId, ref: "Shop", required: true},
    status: {type: String, enum: ["Active", "Disabled"], required: true},
    api_key: {type: String, required: true},
    pickup_address: {type: String, required: true},
    return_address: {type: String, required: true},
  },
  {timestamps: true},
);

export default mongoose.model<ICourier>("Courier", courierSchema);
