import { Request, Response } from "express";
import { ERROR_MESSAGES } from "~/constants/errorMessages";
import ProductsQuantity from "~/models/products_quantity";

export const getProductQtyById = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const product_qty = await ProductsQuantity.findById(id).populate(
			"product_id",
		);

		if (!product_qty) {
			res.status(400).json({ message: ERROR_MESSAGES.productQty });
			return;
		}

		res.status(200).json({
			product_qty,
		});
	} catch (error) {
		res.status(400).json({ error });
	}
};
