import { Response } from "express";
import { validateWithZod } from "~/utils/errorHandling";
import { addProductSchema } from "~/validations/product.schema";
import { ERROR_MESSAGES } from "~/constants/errorMessages";
import Product from "~/models/product";
import { logActivity } from "~/services/activity-logger.service";
import { TAuthenticatedRequest } from "~/types/express";
import User from "~/models/user";
import { uploadImageToGCS } from "~/services/cloud-storage.service";

export const addProduct = async (
	req: TAuthenticatedRequest,
	res: Response,
): Promise<void> => {
	try {
		const validatedData = await validateWithZod(addProductSchema, req.body);

		const image = req.file;

		const { name, barcode, sku, price, low_stock_indicator } = validatedData;

		const product = await Product.findOne({
			$or: [{ sku }, { barcode }],
		});

		if (product) {
			res.status(400).json({ error: ERROR_MESSAGES.productExists });
			return;
		}

		let imageUrl: string | undefined;

		if (image) {
			const publicUrl = await uploadImageToGCS({
				file: image,
				folder: "product-images",
			});
			imageUrl = publicUrl;
		}

		const newProduct = new Product({
			name,
			barcode,
			sku,
			price,
			low_stock_indicator,
			image: imageUrl,
		});

		const savedProduct = await newProduct.save();

		const userId = req.user?._id;
		if (userId) {
			const user = await User.findById(userId);
			await logActivity({
				type: "create_product",
				moduleID: savedProduct._id,
				activity: `Product ${sku} created with barcode ${barcode} by ${user?.full_name || "User"}.`,
				activistId: userId,
			});
		} else {
			console.warn("Activity not logged: User ID not found in request");
		}

		res.status(200).json({
			product: savedProduct,
		});
	} catch (error) {
		res.status(400).json({ error });
	}
};
