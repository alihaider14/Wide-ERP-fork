import { Request, Response } from "express";
import Order from "~/models/order";
import OrderItems from "~/models/order_items";
import OrderLogs from "~/models/order_logs";
import Product from "~/models/product";
import ProductsQuantity from "~/models/products_quantity";
import { validateWithZod } from "~/utils/errorHandling";
import { orderStatusSchema } from "~/validations/orderStatus.schema";
import { TOrderRestorableItem } from "~/types/order";

export const orderStatus = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		const validatedData = await validateWithZod(orderStatusSchema, req.body);
		const { order_id, status, user_id } = validatedData;

		const currentOrder = await Order.findById(order_id);
		if (!currentOrder) {
			throw new Error("Order not found");
		}

		if (currentOrder.status === "completed") {
			const existingItems = await OrderItems.find({ order_id });

			for (const item of existingItems) {
				await restoreAllocations(item as unknown as TOrderRestorableItem);
			}

			await OrderItems.updateMany({ order_id }, { $set: { allocations: [] } });
			const productIds = existingItems.map((item) => item.product_id);
			await updateProductQuantity(productIds);
		}

		const order = await Order.findOneAndUpdate(
			{ _id: order_id },
			{ status },
			{ new: true },
		);

		await OrderLogs.create({
			order_id,
			user_id: user_id,
			status: status || order.status,
			discount: order.discount,
			items_count: order.items_count,
			amount: order.total_amount,
			is_update: true,
		});

		res.status(200).json({
			order,
		});
	} catch (error) {
		res
			.status(error instanceof Error ? 400 : 500)
			.json({ error: error instanceof Error ? error.message : error });
	}
};

async function restoreAllocations(orderItem: TOrderRestorableItem) {
	try {
		for (const alloc of orderItem.allocations) {
			await ProductsQuantity.findByIdAndUpdate(alloc.product_quantity_id, {
				$inc: { remaining_qty: alloc.allocated_quantity },
			});
		}
	} catch (error) {
		throw error;
	}
}

async function updateProductQuantity(productIds: string[]) {
	try {
		await Promise.all(
			productIds.map(async (productId) => {
				const totalQty = await ProductsQuantity.aggregate([
					{ $match: { product_id: productId } },
					{ $group: { _id: null, total: { $sum: "$remaining_qty" } } },
				]);

				await Product.findByIdAndUpdate(productId, {
					qty: totalQty[0]?.total || 0,
				});
			}),
		);
	} catch (error) {
		throw error;
	}
}
