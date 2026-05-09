import { Request, Response } from "express";
import OrderItems from "~/models/order_items";

export const getOrderItems = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		const { order_id } = req.params;

		const orderItems = await OrderItems.find({ order_id }).populate(
			"product_id",
		);

		const data = orderItems?.map((item) => {
			return {
				price: item.price,
				quantity: item.quantity,
				original_price: item.original_price,
				sku: item.product_id?.sku,
			};
		});

		res.status(200).json({
			order_items: data,
		});
	} catch (error) {
		res.status(400).json({ error });
	}
};
