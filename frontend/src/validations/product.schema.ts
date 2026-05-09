import { ERROR_MESSAGES } from "@/constant/errorMessage";
import { z } from "zod";

export const addProductSchema = z.object({
	name: z.string().optional(),
	barcode: z
		.string({ required_error: ERROR_MESSAGES.barcodeRequired })
		.trim()
		.min(1, { message: ERROR_MESSAGES.barcodeRequired })
		.max(10, { message: ERROR_MESSAGES.barcode }),
	sku: z
		.string({ required_error: ERROR_MESSAGES.skuRequired })
		.trim()
		.min(1, { message: ERROR_MESSAGES.skuRequired })
		.max(80, { message: ERROR_MESSAGES.sku }),
	price: z
		.string({ required_error: ERROR_MESSAGES.priceRequired })
		.trim()
		.min(1, { message: ERROR_MESSAGES.priceRequired })
		.pipe(z.coerce.number().nonnegative({ message: ERROR_MESSAGES.price })),

	low_stock_indicator: z.coerce
		.number({
			message: ERROR_MESSAGES.LowStockRequired,
		})
		.int({ message: ERROR_MESSAGES.lowStockIndicatorNotDecimal })
		.nonnegative({ message: ERROR_MESSAGES.lowStockIndicator })
		.optional(),
	image: z.union([z.string(), z.instanceof(File)]).optional(),
});

export const updateProductSchema = z.object({
	productId: z.string().trim(),
	name: z.string().optional(),
	barcode: z
		.string({ required_error: ERROR_MESSAGES.barcodeRequired })
		.trim()
		.min(1, { message: ERROR_MESSAGES.barcodeRequired })
		.max(10, { message: ERROR_MESSAGES.barcode }),
	price: z.coerce
		.number({ required_error: ERROR_MESSAGES.priceRequired })
		.min(1, { message: ERROR_MESSAGES.priceRequired })
		.nonnegative({ message: ERROR_MESSAGES.price }),
	low_stock_indicator: z.coerce
		.number({
			message: ERROR_MESSAGES.LowStockRequired,
		})
		.int({ message: ERROR_MESSAGES.lowStockIndicatorNotDecimal })
		.nonnegative({ message: ERROR_MESSAGES.lowStockIndicator })
		.optional(),
	image: z.union([z.string(), z.instanceof(File)]).optional(),
});

export const importProductsSchema = z.array(
	z.object({
		name: z.string().trim().optional(),
		sku: z
			.string({ required_error: ERROR_MESSAGES.skuRequired })
			.trim()
			.min(1, { message: ERROR_MESSAGES.skuRequired })
			.max(80, { message: ERROR_MESSAGES.sku }),
		barcode: z
			.string({ required_error: ERROR_MESSAGES.barcodeRequired })
			.trim()
			.min(1, { message: ERROR_MESSAGES.barcodeRequired })
			.max(10, { message: ERROR_MESSAGES.barcode }),
		price: z.coerce
			.number({
				required_error: ERROR_MESSAGES.priceRequired,
				invalid_type_error: ERROR_MESSAGES.priceRequired,
			})
			.nonnegative({ message: ERROR_MESSAGES.price }),
		low_stock_indicator: z.coerce
			.number({
				message: ERROR_MESSAGES.LowStockRequired,
			})
			.int({ message: ERROR_MESSAGES.lowStockIndicatorNotDecimal })
			.nonnegative({ message: ERROR_MESSAGES.lowStockIndicator })
			.optional(),
	}),
);

export const syncShopifyProductsSchema = z.object({
	shopId: z
		.string({ required_error: ERROR_MESSAGES.shopRequired })
		.trim()
		.min(1, { message: ERROR_MESSAGES.shopRequired }),
});
