import { Response } from "express";
import { TAuthenticatedRequest } from "~/types/express";
import { validateWithZod } from "~/utils/errorHandling";
import { updateOrderSchema } from "~/validations/order.schema";
import Order from "~/models/order";
import OrderItems from "~/models/order_items";
import ProductsQuantity from "~/models/products_quantity";
import Product from "~/models/product";
import mongoose from "mongoose";
import OrderLogs from "~/models/order_logs";
import { logActivity } from "~/services/activity-logger.service";
import User from "~/models/user";
import {
	TOrderInputItem,
	TOrderItemWithAllocations,
	TOrderRestorableItem,
	TOrderStockCheckItem,
} from "~/types/order";

export const updateOrder = async (
	req: TAuthenticatedRequest,
	res: Response,
): Promise<void> => {
	const session = await mongoose.startSession();
	try {
		const validatedData = await validateWithZod(updateOrderSchema, req.body);

		if (!req.user || !req.user._id) {
			throw new Error("Unauthorized");
		}
		const user_id = req.user._id;
		const { order_id, items, status, ...orderData } = validatedData;
		const orderItems = items as TOrderInputItem[];

		const currentOrder = await Order.findById(order_id);
		if (!currentOrder) {
			throw new Error("Order not found");
		}

		const productIds = orderItems.map((item) => item.product_id.toString());
		if (new Set(productIds).size !== productIds.length) {
			throw new Error("Duplicate products are not allowed in the order.");
		}

		const existingItems = await OrderItems.find({ order_id });

		await session.withTransaction(async () => {
			const existingItemsInTransaction = await OrderItems.find({
				order_id,
			}).session(session);

			const currentOrderInTx = await Order.findById(order_id).session(session);
			if (!currentOrderInTx) {
				throw new Error("Order not found");
			}

			const actualQuantities = await Promise.all(
				orderItems.map(async (item): Promise<TOrderStockCheckItem> => {
					const product = await Product.findById(item.product_id).session(session);
					const existingQty =
						existingItemsInTransaction
							.find((e) => e.product_id.toString() === item.product_id.toString())
							?.quantity || 0;

					return {
						product_id: item.product_id.toString(),
						product_qty:
							currentOrderInTx?.status === "completed"
								? existingQty + (product?.qty || 0)
								: product?.qty,
						quantity: item.quantity,
					};
				}),
			);

			await checkingStocksAndValidProduct(actualQuantities, session);

			for (const item of existingItemsInTransaction) {
				await restoreAllocations(item as unknown as TOrderRestorableItem, session);
			}

			await updateProductQuantity(
				existingItemsInTransaction as unknown as TOrderRestorableItem[],
				session,
			);

			await OrderItems.deleteMany({ order_id }, { session });

			let newItems: TOrderItemWithAllocations[] = [];

			if (status !== "completed") {
				newItems = orderItems.map((item) => ({
					product_id: item.product_id,
					price: item.price,
					original_price: item.original_price,
					quantity: item.quantity,
					order_id: order_id,
					allocations: [],
				}));
			} else {
				newItems = await isValidOrderItem(orderItems, order_id, session);
				await updateProductQuantity(orderItems, session);
			}

			const result = await Order.findByIdAndUpdate(
				order_id,
				{ ...orderData, status },
				{ new: true, session },
			);

			if (!result) {
				throw new Error("Failed to update order");
			}

			await OrderLogs.create(
				[
					{
						order_id,
						user_id: user_id,
						status: status || result.status,
						discount: result.discount,
						items_count: result.items_count,
						amount: result.total_amount,
						is_update: true,
					},
				],
				{ session },
			);

			await OrderItems.insertMany(newItems, { session });
		});

		const updatedOrder = await Order.findById(order_id);
		if (!updatedOrder) {
			throw new Error("Failed to fetch updated order");
		}

		const user = await User.findById(user_id);
		const statusChanged = currentOrder.status !== status;
		const itemsChanged = existingItems.length !== items.length;

		let activityDescription = `Order #${updatedOrder.order_number} updated by ${user?.full_name || "User"}`;
		if (statusChanged) {
			activityDescription += ` - status changed from ${currentOrder.status} to ${status}`;
		}
		if (itemsChanged) {
			activityDescription += ` - items updated`;
		}
		activityDescription += ".";

		await logActivity({
			type: "update_order",
			moduleID: order_id,
			activity: activityDescription,
			activistId: user_id,
		});

		res.status(200).json({
			order: updatedOrder,
		});
	} catch (error) {
		res
			.status(error instanceof Error ? 400 : 500)
			.json({ error: error instanceof Error ? error.message : error });
	} finally {
		await session.endSession();
	}
};

async function restoreAllocations(
	orderItem: TOrderRestorableItem,
	session: mongoose.ClientSession,
) {
	try {
		for (const alloc of orderItem.allocations) {
			await ProductsQuantity.findByIdAndUpdate(
				alloc.product_quantity_id,
				{ $inc: { remaining_qty: alloc.allocated_quantity } },
				{ session },
			);
		}
	} catch (error) {
		throw error;
	}
}

const isValidOrderItem = async (
	orderItems: TOrderInputItem[],
	order_id: string,
	session: mongoose.ClientSession,
): Promise<TOrderItemWithAllocations[]> => {
	try {
		const checkedOrderItems = await Promise.all(
			orderItems.map(async (item) => {
				let remainingQty = item.quantity;
				const allocations: TOrderItemWithAllocations["allocations"] = [];

				const batches = await ProductsQuantity.find({
					product_id: item.product_id,
					remaining_qty: { $gt: 0 },
				})
					.sort({ createdAt: 1 })
					.session(session);

				for (const batch of batches) {
					if (remainingQty <= 0) break;

					const allocated = Math.min(batch.remaining_qty, remainingQty);
					if (allocated <= 0) continue;

					const updatedBatch = await ProductsQuantity.findOneAndUpdate(
						{ _id: batch._id, remaining_qty: { $gte: allocated } },
						{ $inc: { remaining_qty: -allocated } },
						{ new: true, session },
					);

					if (!updatedBatch) {
						throw new Error(
							`Batch stock was taken by a concurrent order for product ${item.product_id}. Please try again.`,
						);
					}

					allocations.push({
						product_quantity_id: batch._id,
						allocated_quantity: allocated,
						allocated_cost: batch?.cost,
					});

					remainingQty -= allocated;
					if (remainingQty === 0) break;
				}

				if (remainingQty > 0) {
					throw new Error(
						`Insufficient batch stock for product ${item.product_id}`,
					);
				}

				return {
					product_id: item.product_id,
					price: item.price,
					quantity: item.quantity,
					original_price: item.original_price,
					allocations,
					order_id,
				};
			}),
		);

		return checkedOrderItems;
	} catch (error) {
		throw error;
	}
};

const checkingStocksAndValidProduct = async (
	items: TOrderStockCheckItem[],
	session: mongoose.ClientSession,
) => {
	try {
		await Promise.all(
			items.map(async (item) => {
				const product = await Product.findById(item.product_id).session(session);

				if (!product || product.status === "deleted") {
					throw new Error(`Product ${product?.sku} not found or inactive`);
				}

				if (item?.product_qty < item?.quantity) {
					throw new Error(`Insufficient stock for product ${product?.sku}.
				  Requested: ${item?.quantity}, Available: ${item?.product_qty || 0}`);
				}
			}),
		);
	} catch (error) {
		throw error;
	}
};

async function updateProductQuantity(
	items: Array<{ product_id: string | mongoose.Types.ObjectId }>,
	session: mongoose.ClientSession,
) {
	try {
		await Promise.all(
			items.map(async (item) => {
				const productId = item.product_id.toString();
				const totalQty = await ProductsQuantity.aggregate([
					{
						$match: {
							product_id: new mongoose.Types.ObjectId(productId),
						},
					},
					{ $group: { _id: null, total: { $sum: "$remaining_qty" } } },
				]).session(session);

				await Product.findByIdAndUpdate(
					productId,
					{ qty: totalQty[0]?.total || 0 },
					{ session },
				);
			}),
		);
	} catch (error) {
		throw error;
	}
}