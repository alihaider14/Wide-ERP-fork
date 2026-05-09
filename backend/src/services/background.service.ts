import axios from "axios";
import { SyncShopifyProducts } from "../models/SyncShopifyProducts";
import { BackgroundTask } from "../models/BackgroundTask";
import Shop from "~/models/shop";
import { decryptApiKey } from "~/utils/encryption";
import Product from "~/models/product";
import { uploadImageToGCS } from "./cloud-storage.service";
import { TSyncNewProduct } from "~/types/sync-shopify-products";

const getNextPageUrl = (linkHeader?: string): string | null => {
	if (!linkHeader) return null;

	const links = linkHeader.split(",");

	for (const link of links) {
		if (link.includes('rel="next"')) {
			return link.split(";")[0].replace("<", "").replace(">", "").trim();
		}
	}

	return null;
};

const getImageAsMulterFile = async (url: string) => {
	const response = await axios.get(url, { responseType: "arraybuffer" });

	const contentType = response.headers["content-type"] || "image/jpeg";

	return {
		fieldname: "file",
		originalname: `shopify-image.${contentType.split("/")[1]}`,
		mimetype: contentType,
		buffer: Buffer.from(response.data),
		size: response.data.length,
	} as Express.Multer.File;
};

export const generateBarcode = (): string => {
	const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	let result = "";

	for (let i = 0; i < 10; i++) {
		const randomChar = characters.charAt(
			Math.floor(Math.random() * characters.length),
		);
		result += randomChar;
	}

	return result;
};

export const processSyncShopifyTask = async () => {
	const task = await BackgroundTask.findOne({
		status: "Active",
		type: "sync_product",
	});

	if (!task) {
		return;
	}

	try {
		const syncDoc = await SyncShopifyProducts.findById(task.doc_id);
		if (!syncDoc) throw new Error("Sync doc missing");

		const shop = await Shop.findOne({
			shopify_store_key: syncDoc.store_name,
		});

		if (!shop) throw new Error("Shop missing");

		const token = decryptApiKey(shop.shopify_api_key);

		const url = syncDoc.cursor
			? `https://${syncDoc.store_name}/admin/api/2026-04/products.json?limit=50&page_info=${syncDoc.cursor}`
			: `https://${syncDoc.store_name}/admin/api/2026-04/products.json?limit=50`;

		const response = await axios.get(url, {
			headers: { "X-Shopify-Access-Token": token },
		});

		const products = response.data.products;

		const newProducts: TSyncNewProduct[] = [];

		for (const p of products) {
			const variant = p.variants?.[0];
			const imageUrl = p.images?.[0]?.src;

			if (!variant?.sku) {
				continue;
			}

			let uploadedImageUrl: string | undefined;

			if (imageUrl) {
				const file = await getImageAsMulterFile(imageUrl);

				uploadedImageUrl = await uploadImageToGCS({
					file,
					folder: "product-images",
				});
			}

			newProducts.push({
				name: p.title,
				sku: variant.sku,
				price: Number(variant.price),
				barcode: generateBarcode(),
				qty: 0,
				image: uploadedImageUrl,
			});
		}

		if (newProducts.length > 0) {
			try {
				const result = await Product.insertMany(newProducts, {
					ordered: false,
				});

				const insertedCount = result.length;

				syncDoc.products_created_count += insertedCount;
			} catch (err: unknown) {
				const bulkInsertError = err as {
					code?: number;
					name?: string;
					insertedDocs?: unknown[];
				};

				if (
					bulkInsertError.code === 11000 ||
					bulkInsertError.name === "BulkWriteError"
				) {
				} else {
					throw err;
				}
			}
		}

		const nextUrl = getNextPageUrl(response.headers.link);

		if (nextUrl) {
			const urlObj = new URL(nextUrl);
			syncDoc.cursor = urlObj.searchParams.get("page_info");
			task.status = "Active";
		} else {
			syncDoc.cursor = null;
			task.status = "Completed";
		}

		await syncDoc.save();
		task.last_run_at = new Date();
		await task.save();
	} catch (error) {
		console.error("Error while processing task:", error);

		task.attempts += 1;
		task.status = task.attempts >= task.max_attempts ? "Error" : "Active";

		// Extract Shopify API error message and update task note
		const axiosError = error as {
			response?: {
				data?: {
					errors?: unknown;
				};
			};
		};
		const shopifyError = axiosError.response?.data?.errors;
		if (shopifyError && task.status == "Error") {
			task.note =
				typeof shopifyError === "string"
					? shopifyError
					: JSON.stringify(shopifyError);
		}

		task.last_run_at = new Date();
		await task.save();
	}
};
