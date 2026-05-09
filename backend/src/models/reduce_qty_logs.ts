import mongoose from "mongoose";
import User from "./user";
import ProductsQuantity from "./products_quantity";

const reduceQtyLogsSchema = new mongoose.Schema(
	{
		adjustment_id: {
			ref: ProductsQuantity,
			type: mongoose.Schema.Types.ObjectId,
			required: true,
		},
		updated_by: {
			ref: User,
			type: mongoose.Schema.Types.ObjectId,
			required: true,
		},

		quantity: {
			type: Number,
			required: true,
		},

		reason: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
	},
);

const ReduceQtyLogs =
	mongoose.models?.reduce_qty_logs ||
	mongoose.model("reduce_qty_logs", reduceQtyLogsSchema);

export default ReduceQtyLogs;
