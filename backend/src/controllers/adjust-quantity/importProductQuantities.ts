import { Request, Response } from "express";
import Product from "~/models/product";
import ProductsQuantity from "~/models/products_quantity";
import StockZone from "~/models/stock_zone";

export const importProductQuantities = async (
	req: Request,
	res: Response,
): Promise<void> => {
		try {
			const importData = req.body;			

			if (!Array.isArray(importData) || importData.length === 0) {
				res.status(400).json({ error: "Invalid data format or empty array." });
				return;
			}

			const stockZoneNames = Array.from(new Set(importData.map(item => item.stock_zone_name?.trim()).filter(Boolean)));
			const stockZones = await StockZone.find({ name: { $in: stockZoneNames } });
			const nameToZoneMap = new Map(stockZones.map(zone => [zone.name, zone]));

			const skus = importData.map((item) => item.sku?.trim()).filter(Boolean);
			const products = await Product.find({ sku: { $in: skus } });
			const skuToProductMap = new Map(products.map((p) => [p.sku, p]));

			const notFoundSkus: string[] = [];
			const quantityDocs = [];
			const productUpdatesMap = new Map<string, number>();

			for (const item of importData) {
				const sku = item.sku?.trim();
				if (!sku || !skuToProductMap.has(sku)) {
					notFoundSkus.push(sku || "");
					continue;
				}
				const product = skuToProductMap.get(sku)!;
				const stockZoneName = item.stock_zone_name?.trim();
				const stockZone = stockZoneName ? nameToZoneMap.get(stockZoneName) : undefined;

				const { cost, quantity, reason, created_by } = item;
				quantityDocs.push({
					product_id: product._id,
					cost,
					quantity,
					remaining_qty: quantity < 0 ? 0 : quantity,
					reason,
					created_by,
					...(stockZone && { stock_zone_id: stockZone._id }),
				});
				productUpdatesMap.set(
					product._id.toString(),
					(productUpdatesMap.get(product._id.toString()) || 0) + quantity,
				);
			}

			if (quantityDocs.length > 0) {
				await ProductsQuantity.insertMany(quantityDocs);
			}

			if (productUpdatesMap.size > 0) {
				const bulkUpdateOps = Array.from(productUpdatesMap.entries()).map(
					([productId, totalQty]) => ({
						updateOne: {
							filter: { _id: productId },
							update: { $inc: { qty: totalQty } },
						},
					}),
				);
				await Product.bulkWrite(bulkUpdateOps);
			}

			if (quantityDocs.length === 0 && notFoundSkus.length > 0) {
				res.status(400).json({
					error: `Product(s) not found for SKU(s): ${notFoundSkus.join(", ")}`,
				});
				return;
			}

			if (notFoundSkus.length > 0) {
				res.status(200).json({
					data: notFoundSkus.map(
						(msg) =>
							`${msg}`,
					),
				});
				return;
			}

			res
				.status(200)
				.json({ message: "Product quantities imported successfully." });
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: "Internal server error" });
		}
};
