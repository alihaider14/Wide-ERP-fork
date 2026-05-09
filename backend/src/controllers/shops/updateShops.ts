import { Request, Response } from "express";
import { validateWithZod } from "~/utils/errorHandling";
import { updateShopSchema } from "~/validations/shop.schema";
import { ERROR_MESSAGES } from "~/constants/errorMessages";
import { encryptApiKey } from "~/utils/encryption";
import Shop from "~/models/shop";

export const updateShop = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		const validatedData = await validateWithZod(updateShopSchema, req.body);
		const shopId = validatedData.shopId;

		const shop = await Shop.findOne({ _id: shopId });
		if (!shop) {
			res.status(400).json({ error: "Shop not found" });
			return;
		}
		const orConditions: Array<Record<string, string>> = [];
		if (validatedData.name && validatedData.name !== shop.name) {
			orConditions.push({ name: validatedData.name });
		}
		if (
			validatedData.shopify_store_key &&
			validatedData.shopify_store_key !== shop.shopify_store_key
		) {
			orConditions.push({ shopify_store_key: validatedData.shopify_store_key });
		}

		if (orConditions.length > 0) {
			const shopAlreadyExists = await Shop.findOne({
				_id: { $ne: shop._id },
				$or: orConditions,
			});

			if (shopAlreadyExists) {
				res.status(400).json({
					error:
						ERROR_MESSAGES.shopExists ||
						"Shop with this name or store key already exists.",
				});
				return;
			}
		}

		const { shopId: _shopId, ...updates } = validatedData;

		const updatesWithEncryption = {
			...updates,
			...(updates.shopify_api_key && {
				shopify_api_key: encryptApiKey(updates.shopify_api_key),
			}),
			...(updates.meta_api_key && {
				meta_api_key: encryptApiKey(updates.meta_api_key),
			}),
		};

		const updatedData = await Shop.updateOne(
			{ _id: shopId },
			{ $set: updatesWithEncryption },
		);

		if (updatedData.modifiedCount > 0) {
			const updatedShop = await Shop.findOne({ _id: shopId });

			const responseShop = {
				...updatedShop?.toObject(),
				shopify_api_key: undefined,
				meta_api_key: undefined,
			};

			res.status(200).json({
				shop: responseShop,
			});
		} else {
			res.status(400).json({
				message: ERROR_MESSAGES.somethingWentWrong,
			});
		}
	} catch (error: unknown) {
		if (
			error &&
			typeof error === "object" &&
			"validation" in error
		) {
			const typedError = error as {
				status?: number;
				validation?: Record<string, string>;
				message?: string;
			};

			const status = typedError.status || 400;
			const details = typedError.validation || {};
			const message = Object.entries(details)
				.map(([k, v]) => `${k}: ${v}`)
				.join("; ");
			res.status(status).json({
				error: "Validation failed",
				message: message || "Validation failed",
				details,
			});
			return;
		}

		res.status(400).json({ error: error instanceof Error ? error.message : error });
	}
};
