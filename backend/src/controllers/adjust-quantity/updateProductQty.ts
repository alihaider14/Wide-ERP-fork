import { Request, Response } from "express";
import { validateWithZod } from "~/utils/errorHandling";
import { updateAdjustQtySchema } from "~/validations/productQuantity.schema";
import { ERROR_MESSAGES } from "~/constants/errorMessages";
import { TProductQty } from "~/types/product-qty";
import Product from "~/models/product";
import ProductsQuantity from "~/models/products_quantity";

export const updateProductQty = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		// Validate user input
		const validatedData = await validateWithZod(
			updateAdjustQtySchema,
			req.body,
		);

const { productQtyId, product_id, reason } = validatedData;

	//check if product qty already exists
	const productQty = await ProductsQuantity.findOne({
		_id: productQtyId,
	});

	if (!productQty) {
		res.status(400).json({ error: ERROR_MESSAGES.productQty });
		return;
	}

	//check if product already exists
	const product = await Product.findById(product_id || productQty.product_id);

	if (!product) {
		res.status(400).json({ error: ERROR_MESSAGES.productNotExists });
		return;
	}

	const updates: Partial<TProductQty> = {};

	if (product_id) updates.product_id = product_id;
		if (reason) updates.reason = reason;

		const updatedData = await ProductsQuantity.updateOne(
			{
				_id: productQtyId,
			},
			{
				$set: updates,
			},
		);

		if (updatedData.modifiedCount > 0) {
			res.status(200).json({
				product_qty: { ...productQty.toObject(), ...updates },
			});
		} else {
			res.status(400).json({
				message: ERROR_MESSAGES.somethingWentWrong,
			});
		}
	} catch (error) {
		res.status(400).json({ error });
	}
};
