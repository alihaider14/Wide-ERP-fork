import { Request, Response } from "express";
import Product from "~/models/product";

export const importProducts = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		const products = req.body;

		if (products?.length === 0) {
			res.status(400).json({ error: "File contains no data." });
			return;
		}

		const skuSet = new Set();
		const barcodeSet = new Set();
		const duplicateProducts = [];

		for (const product of products) {
			if (skuSet.has(product.sku) || barcodeSet.has(product.barcode)) {
				duplicateProducts.push({
					sku: product.sku,
				});
			} else {
				skuSet.add(product.sku);
				barcodeSet.add(product.barcode);
			}
		}

		if (duplicateProducts.length > 0) {
			res.status(400).json({
				error: "Some products have duplicate SKUs or Barcodes in the request.",
			});
			return;
		}

		const existing = await Product.find({
			$or: [
				{ sku: { $in: Array.from(skuSet) } },
				{ barcode: { $in: Array.from(barcodeSet) } },
			],
		}).select("sku barcode");

		const existingSkuSet = new Set(existing.map((p) => p.sku));
		const existingBarcodeSet = new Set(existing.map((p) => p.barcode));

		const validProducts = [];
		const skippedProducts = [];

		for (const product of products) {
			if (
				existingSkuSet.has(product.sku) ||
				existingBarcodeSet.has(product.barcode)
			) {
				skippedProducts.push({
					sku: product.sku,
				});
			} else {
				validProducts.push(product);
			}
		}

		if (validProducts.length > 0) {
			await Product.insertMany(validProducts);
		} else if (skippedProducts.length > 0) {
			res.status(400).json({
				error: "No valid products to import all are already exists.",
			});
			return;
		}

		res.status(200).json({
			skipped_products: skippedProducts.map(
				(product) =>
					`Product with SKU ${product.sku} has been skipped because its already exists.`,
			),
		});
	} catch (error) {
		res.status(400).json({ error: error || "An error occurred." });
	}
};
