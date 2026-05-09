import { Request, Response } from "express";
import { validateWithZod } from "~/utils/errorHandling";
import { getDashboardSchema } from "~/validations/dashboard.schema";
import Order from "~/models/order";
import OrderItems from "~/models/order_items";
import ProductsQuantity from "~/models/products_quantity";

export const getDashboardAnalytics = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const validatedData = await validateWithZod(getDashboardSchema, req.query);
		const { from, to } = validatedData;
		if (!from || !to) {
			res.status(400).json({ error: "Missing from or to query params" });
			return;
		}
		const fromDate = new Date(from as string);
		const toDate = new Date(to as string);

		if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
			res.status(400).json({ error: "Invalid date format for from or to" });
			return;
		}

		fromDate.setHours(0, 0, 0, 0);
		toDate.setHours(23, 59, 59, 999);

		const orderAggregation = await Order.aggregate([
			{
				$match: {
					status: "completed",
					createdAt: {
						$gte: fromDate,
						$lt: toDate
					}
				}
			},
			{
				$group: {
					_id: null,
					salesAmount: { $sum: "$total_amount" },
					numberOfOrders: { $sum: 1 },
					totalDiscount: {
						$sum: { $subtract: ["$sub_total_amount", "$total_amount"] }
					},
					orderIds: { $push: "$_id" }
				}
			}
		]);

		const aggregationResult = orderAggregation[0] || {
			salesAmount: 0,
			numberOfOrders: 0,
			orderIds: [],
			totalDiscount: 0
		};

		const { salesAmount, numberOfOrders, orderIds, totalDiscount } =
			aggregationResult;

		let itemsSold = 0;
		let totalCost = 0;

		if (orderIds.length > 0) {
			// Calculate total items sold
			const itemsSoldAgg = await OrderItems.aggregate([
				{ $match: { order_id: { $in: orderIds } } },
				{ $group: { _id: null, itemsSold: { $sum: "$quantity" } } }
			]);
			itemsSold = itemsSoldAgg[0]?.itemsSold || 0;

			// Calculate total cost from allocations
			const totalCostAgg = await OrderItems.aggregate([
				{ $match: { order_id: { $in: orderIds } } },
				{ $unwind: "$allocations" },
				{
					$group: {
						_id: null,
						totalCost: {
							$sum: {
								$multiply: [
									"$allocations.allocated_quantity",
									"$allocations.allocated_cost"
								]
							}
						}
					}
				}
			]);
			totalCost = totalCostAgg[0]?.totalCost || 0;
		}

		const grossProfit = Number(salesAmount - totalCost) || 0;

		// Calculate profit percentage
		let profitPercent = 0;
		if (salesAmount > 0) {
			profitPercent = (grossProfit / salesAmount) * 100;
		}
		profitPercent = Math.round(profitPercent * 100) / 100; // round to 2 decimals

		const availableItemsAndCostData = await ProductsQuantity.aggregate([
			{
				$match: {}
			},
			{
				$group: {
					_id: null,
					availableItems: { $sum: "$remaining_qty" },
					averageItemsCost: {
						$sum: {
							$multiply: ["$cost", "$remaining_qty"]
						}
					}
				}
			},
			{
				$project: {
					_id: 0,
					availableItems: 1,
					averageItemsCost: 1
				}
			}
		]);

		const { availableItems, averageItemsCost } =
			availableItemsAndCostData[0] || {
				availableItems: 0,
				averageItemsCost: 0
			};

		const data = [
			{
				label: "Sales",
				value: salesAmount
			},
			{
				label: "Orders",
				value: numberOfOrders
			},
			{
				label: "Items Sold",
				value: itemsSold
			},
			{
				label: "Gross Profit",
				value: grossProfit
			},
			{
				label: "Cost",
				value: totalCost
			},
			{
				label: "Discount",
				value: totalDiscount
			},
			{
				label: "Profit %",
				value: profitPercent
			},
			{
				label: "Available Items",
				value: availableItems
			},
			{
				label: "Av. Items Cost",
				value: averageItemsCost
			}
		];

		res.status(200).json({
			data
		});
	} catch (error) {
		res.status(400).json({ error: error });
	}
};

export const getOrdersOverTime = async (req: Request, res: Response) => {
	try {
		const { from, to } = req.query;
		if (!from || !to) {
			return res.status(400).json({ error: "Missing from or to query params" });
		}
		const fromDate = new Date(from as string);
		const toDate = new Date(to as string);

		// Check for invalid dates
		if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
			return res
				.status(400)
				.json({ error: "Invalid date format for 'from' or 'to' query params" });
		}

		// Set to start of day for 'from'
		fromDate.setHours(0, 0, 0, 0);
		// Set to the end of the day instead of 24th hour
		toDate.setHours(23, 59, 59, 999);

		const orders = await Order.aggregate([
			{
				$match: {
					createdAt: {
						$gte: fromDate,
						$lt: toDate
					}
				}
			},
			{
				$group: {
					_id: {
						$dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
					},
					ordersCount: { $sum: 1 }
				}
			},
			{
				$sort: { _id: 1 }
			},
			{
				$project: {
					_id: 0,
					date: "$_id",
					ordersCount: 1
				}
			}
		]);

		res.json({ data: orders });
	} catch (error) {
		res.status(500).json({ error: (error as Error).message || "Server error" });
	}
};

export const getSalesOverTime = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const { from, to } = req.query;
		if (!from || !to) {
			res.status(400).json({ error: "Missing from or to query params" });
			return;
		}
		const fromDate = new Date(from as string);
		const toDate = new Date(to as string);

		// Check for invalid dates
		if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
			res.status(400).json({ error: "Invalid date format for from or to" });
			return;
		}

		// Set to start of day for 'from'
		fromDate.setHours(0, 0, 0, 0);
		// Set to the end of the day instead of 24th hour
		toDate.setHours(23, 59, 59, 999);

		const sales = await Order.aggregate([
			{
				$match: {
					createdAt: {
						$gte: fromDate,
						$lt: toDate
					}
				}
			},
			{
				$group: {
					_id: {
						$dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
					},
					sales: { $sum: "$total_amount" }
				}
			},
			{ $sort: { _id: 1 } },
			{
				$project: {
					_id: 0,
					date: "$_id",
					sales: 1
				}
			}
		]);

		res.json({ data: sales });
	} catch (error) {
		res.status(500).json({ error: (error as Error).message || "Server error" });
	}
};

export const getTopSellingProducts = async (req: Request, res: Response) => {
	try {
		const { from, to, limit = 5 } = req.query;
		const fromDate = new Date(from as string);
		const toDate = new Date(to as string);

		// Check for invalid dates
		if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
			res.status(400).json({ error: "Invalid date format for from or to" });
			return;
		}

		// Set to start of day for 'from'
		fromDate.setHours(0, 0, 0, 0);
		// Set to the end of the day instead of 24th hour
		toDate.setHours(23, 59, 59, 999);

		const topProducts = await OrderItems.aggregate([
			{
				$lookup: {
					from: "orders",
					let: { orderId: "$order_id" },
					pipeline: [{ $match: { $expr: { $eq: ["$_id", "$$orderId"] } } }],
					as: "order"
				}
			},
			{ $unwind: "$order" },
			{
				$match: {
					"order.createdAt": { $gte: fromDate, $lt: toDate },
					"order.status": "completed"
				}
			},
			{
				$group: {
					_id: "$product_id",
					totalSold: { $sum: "$quantity" }
				}
			},
			{ $sort: { totalSold: -1 } },
			{ $limit: Number(limit) },
			{
				$lookup: {
					from: "products",
					localField: "_id",
					foreignField: "_id",
					as: "product"
				}
			},
			{ $unwind: "$product" },
			{
				$project: {
					_id: 0,
					productId: "$product._id",
					name: "$product.name",
					sku: "$product.sku",
					totalSold: 1
				}
			}
		]);

		res.json({ data: topProducts });
	} catch (error) {
		res.status(500).json({ error: (error as Error).message || "Server error" });
	}
};
