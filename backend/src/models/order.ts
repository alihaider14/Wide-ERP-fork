import mongoose from "mongoose";
import User from "./user";

const orderSchema = new mongoose.Schema(
	{
		order_number: {
			type: Number,
			unique: true,
		},
		customer_name: {
			type: String,
			required: true,
		},
		customer_phone: {
			type: String,
			default: "",
		},
		discount: {
			type: String,
			default: "",
		},
		sub_total_amount: {
			type: Number,
			default: 0,
		},
		total_amount: {
			type: Number,
			required: true,
		},
		items_count: {
			type: Number,
			required: true,
		},
		created_by: {
			ref: User,
			type: mongoose.Schema.Types.ObjectId,
			required: true,
		},
		status: {
			type: String,
			enum: ["completed", "drafted", "cancelled"],
			required: true,
		},
	},
	{
		timestamps: true,
	},
);

const Order = mongoose.models?.orders || mongoose.model("orders", orderSchema);

export default Order;
