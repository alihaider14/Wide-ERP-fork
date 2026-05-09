import { Request, Response } from "express";
import { ERROR_MESSAGES } from "~/constants/errorMessages";
import Product from "~/models/product";

export const getProductById = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const product = await Product.findById(id);

		if (!product) {
			res.status(400).json({ message: ERROR_MESSAGES.product });
			return;
		}

		res.status(200).json({
			product,
		});
	} catch (error) {
		res.status(400).json({ error });
	}
};
