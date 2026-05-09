export type TProduct = {
	_id: string;
	name: string;
	barcode: string;
	sku: string;
	price: number;
	qty?: number;
	low_stock_indicator?: number;
	image?: string | File;
	createdAt: Date;
	updatedAt: Date;
};

export type TPrintProducts = {
	name: string;
	qty: string;
	image?: string;
};

export type TGetProductResponse = {
	total_pages: number;
	total_rows: number;
	from: number;
	to: number;
	products: TProduct[];
	products_count: number;
	items: number;
	sold_out: number;
	low_stock_items: number;
};

export type TAddAndUpdateProductResponse = {
	product: TProduct;
};

export type TImportProductsResponse = {
	skipped_products: string[];
};

export type TProductFilter = "sold_out" | "low_stock" | undefined;
