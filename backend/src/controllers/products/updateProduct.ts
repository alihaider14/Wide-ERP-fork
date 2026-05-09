import { Request, Response } from "express";
import { validateWithZod } from "~/utils/errorHandling";
import { updateProductSchema } from "~/validations/product.schema";
import { ERROR_MESSAGES } from "~/constants/errorMessages";
import { TProduct } from "~/types/product";
import Product from "~/models/product";
import {
	deleteImageFromGCS,
	uploadImageToGCS,
} from "~/services/cloud-storage.service";

export const updateProduct = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		const validatedData = await validateWithZod(updateProductSchema, req.body);

		const { name, productId, barcode, sku, price, low_stock_indicator } =
			validatedData;

		//check if product already exists
		const product = await Product.findOne({ _id: productId });

		if (!product) {
			res.status(400).json({ error: ERROR_MESSAGES.product });
			return;
		}

		const productAlreadyExists = await Product.findOne({
			_id: { $ne: productId }, // Exclude the current product from the check
			$or: [{ sku }, { barcode }],
		});

		if (productAlreadyExists) {
			res.status(400).json({ error: ERROR_MESSAGES.productExists });
			return;
		}

		let imageUrl: string | undefined;

		if (req.file) {
			if (product?.image) await deleteImageFromGCS(product?.image);

			const publicUrl = await uploadImageToGCS({
				file: req.file,
				folder: "product-images",
			});
			imageUrl = publicUrl;
		}

		const updates: Partial<TProduct> = {};

		if (name) updates.name = name;
		if (barcode) updates.barcode = barcode;
		if (sku) updates.sku = sku;
		if (price) updates.price = price;
		updates.low_stock_indicator = low_stock_indicator;
		if (imageUrl) updates.image = imageUrl;

		const updatedData = await Product.updateOne(
			{
				_id: productId,
			},
			{
				$set: updates,
			},
		);

		if (updatedData.modifiedCount > 0) {
			res.status(200).json({
				product: { ...product.toObject(), ...updates },
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
