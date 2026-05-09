export type TProductQty = {
	product_id: string;
	cost: number;
	quantity: number;
	reason: number;
	remaining_qty: number;
};

export type TProductQuantityQuery = {
	product_id: string;
	reason?: { $regex: string; $options: string };
	createdAt?: { $gte?: Date; $lte?: Date };
};
