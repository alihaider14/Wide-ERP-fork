import { Request, Response } from "express";
import { ERROR_MESSAGES } from "~/constants/errorMessages";
import Product from "~/models/product";

export const deleteProductById = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const product = await Product.findById(id);

		if (!product) {
			res.status(400).json({ message: ERROR_MESSAGES.product });
			return;
		}

		const softDeletedProduct = await Product.findByIdAndUpdate(id, {
			status: "deleted",
		});

		res.status(200).json({
			product: softDeletedProduct,
		});
	} catch (error) {
		res.status(400).json({ error });
	}
};
