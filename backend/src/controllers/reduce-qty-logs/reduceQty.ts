import ProductsQuantity from "~/models/products_quantity";
import ReduceQtyLogs from "~/models/reduce_qty_logs";
import { validateWithZod } from "~/utils/errorHandling";
import { reduceQtyLogSchema } from "~/validations/reduceQtyLogs.schema";
import { Response } from "express";
import { TAuthenticatedRequest } from "~/types/express";
import Product from "~/models/product";

export const reduceQty = async (req: TAuthenticatedRequest, res: Response): Promise<void> => {
	try {
		const validatedData = await validateWithZod(reduceQtyLogSchema, req.body);

		if (!req.user || !req.user._id) {
			throw new Error("Unauthorized");
		}
		const updated_by = req.user._id; 
		const { reason, quantity, adjustment_id } = validatedData;

		const productsQuantity = await ProductsQuantity.findById(adjustment_id);
		if (!productsQuantity) {
			throw new Error("Adjustment not found");
		}

		const product = await Product.findById(productsQuantity.product_id);
		if (!product) {
			throw new Error("Product not found");
		}

		if (
			productsQuantity.remaining_qty + quantity < 0 ||
			product?.qty + quantity < 0
		) {
			throw new Error(
				`Cannot reduce by ${Math.abs(quantity)}. Only ${
					productsQuantity.remaining_qty
				} remaining.`,
			);
		}

		await ProductsQuantity.findOneAndUpdate(
			{ _id: adjustment_id },
			{ remaining_qty: productsQuantity.remaining_qty + quantity },
			{ new: true },
		);

		await Product.findOneAndUpdate(
			product?._id,
			{ qty: product?.qty + quantity },
			{ new: true },
		);

		const newReduceQtyLog = new ReduceQtyLogs({
			reason,
			quantity,
			updated_by,
			adjustment_id,
		});

		const savedReduceQtyLog = await newReduceQtyLog.save();

		res.status(200).json({
			reduce_qty_log: savedReduceQtyLog,
		});
	} catch (error) {
		res
			.status(error instanceof Error ? 400 : 500)
			.json({ error: error instanceof Error ? error.message : error });
	}
};
