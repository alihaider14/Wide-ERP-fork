import mongoose from "mongoose";
import Order from "./order";
import Product from "./product";

const orderItemsSchema = new mongoose.Schema(
	{
		order_id: {
			ref: Order,
			type: mongoose.Schema.Types.ObjectId,
			required: false,
		},
		shopify_order_id: {
			type: String,
			default: "",
			required: false,
		},
		product_id: {
			ref: Product,
			type: mongoose.Schema.Types.ObjectId,
			required: true,
		},
		price: {
			type: Number,
			required: true,
		},
		quantity: {
			type: Number,
			required: true,
		},
		original_price: {
			type: Number,
			required: true,
		},
		allocations: [
			{
				product_quantity_id: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "products_quantity",
					required: true,
				},
				allocated_quantity: {
					type: Number,
					required: true,
				},
				allocated_cost: {
					type: Number,
					required: true,
				},
			},
		],
	},
	{
		timestamps: true,
	},
);

const OrderItems =
	mongoose.models?.order_items ||
	mongoose.model("order_items", orderItemsSchema);

export default OrderItems;
