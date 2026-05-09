import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
	{
		name: {
			type: String,
		},
		image: {
			type: String,
			required: false,
		},
		barcode: {
			type: String,
			required: true,
			unique: true,
		},
		low_stock_indicator: {
			type: Number,
			required: false,
			default: 0,
		},
		sku: {
			type: String,
			required: true,
			unique: true,
		},
		price: {
			type: Number,
			required: true,
		},
		qty: {
			type: Number,
			default: 0,
		},
		status: {
			type: String,
			enum: ["active", "deleted"],
			default: "active",
		},
	},
	{
		timestamps: true,
	},
);

const Product =
	mongoose.models?.products || mongoose.model("products", productSchema);

export default Product;
