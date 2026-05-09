import { Request, Response } from "express";

import Order from "~/models/order";

export const getOrders = async (req: Request, res: Response): Promise<void> => {
	try {
		const pageNo = Number(req.query.pageNo) || 1;
		const size = Number(req.query.size) || 10;
		const q = req.query.q?.toString().trim();

		const query: {
			$or?: Array<
				| { customer_name: { $regex: string; $options: string } }
				| { customer_phone: { $regex: string; $options: string } }
				| { order_number: number }
			>;
			createdAt?: { $gte?: Date; $lte?: Date };
		} = {};
		if (q) {
			query.$or = [
				{ customer_name: { $regex: q, $options: "i" } },
				{ customer_phone: { $regex: q, $options: "i" } },
			];
			const numericQuery = Number(q);
			if (!isNaN(numericQuery)) {
				query.$or.push({ order_number: numericQuery });
			}
		}

		// Date range filter
		const fromDate = req.query.from
			? new Date(req.query.from as string)
			: undefined;
		const toDate = req.query.to ? new Date(req.query.to as string) : undefined;
		if (fromDate && toDate) {
			query.createdAt = { $gte: fromDate, $lte: toDate };
		} else if (fromDate) {
			query.createdAt = { $gte: fromDate };
		} else if (toDate) {
			query.createdAt = { $lte: toDate };
		}

		const totalCount = await Order.countDocuments(query);

		const totalPages = Math.ceil(totalCount / size);

		const now = new Date();
		const startOfDay = new Date(now);
		startOfDay.setHours(0, 0, 0, 0);

		const endOfDay = new Date(now);
		endOfDay.setHours(23, 59, 59, 999);

		const todaySales = await Order.aggregate([
			{
				$match: {
					createdAt: { $gte: startOfDay, $lt: endOfDay },
					status: "completed",
				},
			},
			{
				$group: {
					_id: null,
					total: { $sum: "$total_amount" },
				},
			},
		]);

		const to = (await size) * pageNo;
		const from = to - (size - 1);

		const orders = await Order.find(query)
			.populate("created_by")
			.skip(size * (pageNo - 1))
			.limit(size)
			.sort({ createdAt: "desc" });

		res.status(200).json({
			total_pages: totalPages,
			total_rows: totalCount,
			from,
			today_sales: todaySales[0]?.total ? todaySales[0]?.total : 0 || 0,
			to: to > totalCount ? totalCount : to,
			orders: orders,
		});
	} catch (error) {
		res.status(400).json({ error });
	}
};
