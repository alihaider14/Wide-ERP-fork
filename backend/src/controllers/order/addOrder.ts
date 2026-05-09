import { Response } from "express";
import { validateWithZod } from "~/utils/errorHandling";
import { addOrderSchema } from "~/validations/order.schema";
import Order from "~/models/order";
import OrderItems from "~/models/order_items";
import ProductsQuantity from "~/models/products_quantity";
import Counter from "~/models/counter";
import Product from "~/models/product";
import mongoose from "mongoose";
import OrderLogs from "~/models/order_logs";
import { logActivity } from "~/services/activity-logger.service";
import User from "~/models/user";
import {
	TOrderInputItem,
	TOrderItemWithAllocations,
} from "~/types/order";
import { TAuthenticatedRequest } from "~/types/express";

export const addOrder = async (req: TAuthenticatedRequest, res: Response): Promise<void> => {
	const session = await mongoose.startSession();
	try {
		const validatedData = await validateWithZod(addOrderSchema, req.body);

		if (!req.user || !req.user._id) {
			throw new Error("Unauthorized");
		}
		const created_by = req.user._id;

		const {
			customer_name,
			customer_phone,
			discount,
			sub_total_amount,
			total_amount,
			items_count,
			items,
			status,
		} = validatedData;
		const orderItems = items as TOrderInputItem[];

		const productIds = orderItems.map((item) => item.product_id.toString());
		if (new Set(productIds).size !== productIds.length) {
			throw new Error("Duplicate products are not allowed in the order.");
		}

		let savedOrderId!: mongoose.Types.ObjectId;
		let savedOrderNumber!: number;

		await session.withTransaction(async () => {
			await checkingStocksAndValidProduct(orderItems, session);

			const counter = await Counter.findByIdAndUpdate(
				{ _id: "order_number" },
				{ $inc: { sequence_value: 1 } },
				{ new: true, upsert: true, session },
			);

			const newOrder = new Order({
				order_number: counter.sequence_value,
				customer_name,
				customer_phone,
				discount,
				sub_total_amount,
				total_amount,
				items_count,
				created_by,
				status,
			});

			let newItems: TOrderItemWithAllocations[] = [];
			if (status === "drafted") {
				newItems = orderItems.map((item) => ({
					product_id: item.product_id,
					price: item.price,
					original_price: item.original_price,
					quantity: item.quantity,
					order_id: newOrder._id,
					allocations: [],
				}));
			} else {
				newItems = await isValidOrderItem(orderItems, session);
				await updateProductQuantity(orderItems, session);
			}

			const savedOrder = await newOrder.save({ session });

			await OrderLogs.create(
				[
					{
						order_id: savedOrder._id,
						user_id: created_by,
						status,
						discount,
						items_count,
						amount: total_amount,
						is_update: false,
					},
				],
				{ session },
			);

			const updatedOrderItems = newItems.map((item) => ({
				...item,
				order_id: savedOrder._id,
			}));

			await OrderItems.insertMany(updatedOrderItems, { session });

			savedOrderId = savedOrder._id;
			savedOrderNumber = savedOrder.order_number;
		});

		const order = await Order.findById(savedOrderId);
		const user = await User.findById(created_by);

		await logActivity({
			type: "create_order",
			moduleID: savedOrderId,
			activity: `Order #${savedOrderNumber} created by ${user?.full_name || "User"} with ${items_count} items.`,
			activistId: created_by,
		});

		res.status(200).json({ order });
	} catch (error) {
		res
			.status(error instanceof Error ? 400 : 500)
			.json({ error: error instanceof Error ? error.message : error });
	} finally {
		await session.endSession();
	}
};

const isValidOrderItem = async (
	orderItems: TOrderInputItem[],
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

					const deductQty = Math.min(batch.remaining_qty, remainingQty);

					const updatedBatch = await ProductsQuantity.findOneAndUpdate(
						{ _id: batch._id, remaining_qty: { $gte: deductQty } },
						{ $inc: { remaining_qty: -deductQty } },
						{ new: true, session },
					);

					if (!updatedBatch) {
						throw new Error(
							`Batch stock was taken by a concurrent order for product ${item.product_id}. Please try again.`,
						);
					}

					allocations.push({
						product_quantity_id: batch._id,
						allocated_quantity: deductQty,
						allocated_cost: batch?.cost,
					});

					remainingQty -= deductQty;
				}

				if (remainingQty > 0) {
					throw new Error(
						`Insufficient batch stock for product ${item.product_id}`,
					);
				}

				return {
					product_id: item.product_id,
					price: item.price,
					original_price: item.original_price,
					quantity: item.quantity,
					allocations,
				};
			}),
		);

		return checkedOrderItems;
	} catch (error) {
		throw error;
	}
};

const checkingStocksAndValidProduct = async (
	items: TOrderInputItem[],
	session: mongoose.ClientSession,
) => {
	try {
		await Promise.all(
			items.map(async (item) => {
				const product = await Product.findById(item.product_id).session(session);

				if (!product || product.status === "deleted") {
					throw new Error(`Product ${product?.sku} not found or inactive`);
				}

				if (product?.qty < item?.quantity) {
					throw new Error(`Insufficient stock for product ${product?.sku}.
				  Requested: ${item?.quantity}, Available: ${product.qty || 0}`);
				}
			}),
		);
	} catch (error) {
		throw error;
	}
};

async function updateProductQuantity(
	items: Array<{ product_id: string }>,
	session: mongoose.ClientSession,
) {
	try {
		await Promise.all(
			items.map(async (item) => {
				const totalQty = await ProductsQuantity.aggregate([
					{
						$match: {
							product_id: new mongoose.Types.ObjectId(
								item?.product_id as string,
							),
						},
					},
					{ $group: { _id: null, total: { $sum: "$remaining_qty" } } },
				]).session(session);

				await Product.findByIdAndUpdate(
					item.product_id,
					{ qty: totalQty[0]?.total || 0 },
					{ session },
				);
			}),
		);
	} catch (error) {
		throw error;
	}
}