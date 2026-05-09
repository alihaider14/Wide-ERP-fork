import { Request, Response } from "express";
import { validateWithZod } from "~/utils/errorHandling";
import { getProductsSchema } from "~/validations/product.schema";
import Product from "~/models/product";

export const getProducts = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		const validatedData = await validateWithZod(getProductsSchema, req.query);

		const {
			pageNo,
			size,
			q,
			status,
			filter: _filter,
			sortBy,
			sortOrder,
		} = validatedData;

		const filter: {
			$or?: Array<
				| { sku: { $regex: string; $options: string } }
				| { barcode: { $regex: string; $options: string } }
			>;
			status: string;
			qty?: { $lte: number };
			$expr?: {
				$and: Array<Record<string, unknown>>;
			};
		} = {
			status: "active",
		};

		if (q) {
			filter.$or = [
				{ sku: { $regex: q, $options: "i" } },
				{ barcode: { $regex: q, $options: "i" } },
			];
		}

		if (status) {
			filter.status = status;
		}

		const low_stock_logic = {
			$and: [
				{ $gt: ["$low_stock_indicator", 0] },
				{ $lt: ["$qty", "$low_stock_indicator"] },
			],
		};

		if (_filter === "sold_out") {
			filter.qty = { $lte: 0 };
		} else if (_filter === "low_stock") {
			filter.$expr = low_stock_logic;
		}

		// Determine sort field and order
		let sortField = "createdAt";
		let sortDirection: 1 | -1 = -1;
		if (sortBy) {
			sortField = sortBy;
			if (sortOrder === "asc") sortDirection = 1;
			else if (sortOrder === "desc") sortDirection = -1;
		}

		const totalCount = await Product.countDocuments(filter);

		const queryOptions = {
			skip: size * (pageNo - 1),
			limit: size,
		};

		const totalPages = Math.ceil(totalCount / size);
		const to = size * pageNo;
		const from = to - (size - 1);

		const products = await Product.find(filter, {}, queryOptions).sort({
			[sortField]: sortDirection,
			_id: sortDirection,
		});

		const stats = await Product.aggregate([
			{
				$match: { status: filter.status },
			},
			{
				$facet: {
					totalProducts: [{ $count: "count" }],

					totalQuantity: [
						{
							$group: {
								_id: null,
								totalQty: { $sum: "$qty" },
							},
						},
					],

					soldOutProducts: [
						{ $match: { qty: { $lte: 0 } } },
						{ $count: "count" },
					],

					lowStockProducts: [
						{
							$match: {
								$expr: low_stock_logic,
							},
						},
						{ $count: "count" },
					],
				},
			},
		]);

		const { totalProducts, totalQuantity, soldOutProducts, lowStockProducts } =
			stats[0];

		res.status(200).json({
			total_pages: totalPages,
			total_rows: totalCount,
			from,
			to: to > totalCount ? totalCount : to,
			products,
			products_count: totalProducts[0]?.count || 0,
			items: totalQuantity[0]?.totalQty || 0,
			sold_out: soldOutProducts[0]?.count || 0,
			low_stock_items: lowStockProducts[0]?.count || 0,
		});
	} catch (error) {
		res.status(400).json({ error });
	}
};
