import { Document } from "mongoose";

export interface ISyncShopifyProducts extends Document {
	store_name: string;
	cursor: string | null;
	products_created_count: number;
	createdAt?: Date;
	updatedAt?: Date;
}

export type TSyncNewProduct = {
	name: string;
	sku: string;
	price: number;
	barcode: string;
	qty: number;
	image?: string;
};
