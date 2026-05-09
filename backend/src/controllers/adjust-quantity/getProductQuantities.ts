import { Request, Response } from 'express';
import ProductsQuantity from '~/models/products_quantity';
import ReduceQtyLogs from '~/models/reduce_qty_logs';
import { TProductQuantityQuery } from '~/types/product-qty';
import { validateWithZod } from '~/utils/errorHandling';
import { getProductQtySchema } from '~/validations/productQuantity.schema';
export const getProductQuantities = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const validatedData = await validateWithZod(getProductQtySchema, req.query);

    const { pageNo, size, product_id, q, from, to } = validatedData;

    const query: TProductQuantityQuery = { product_id };

    if (q) query.reason = { $regex: q, $options: 'i' };

    if (from || to) {
      query.createdAt = {};
      if (from) query.createdAt.$gte = new Date(from);
      if (to) query.createdAt.$lte = new Date(to);
    }

    const totalCount = await ProductsQuantity.countDocuments(query);

    const totalPages = Math.ceil(totalCount / size);
    const toItem = size * pageNo;
    const fromItem = toItem - (size - 1);

    const productQuantities = await ProductsQuantity.find(query)
      .populate('created_by')
      .skip(size * (pageNo - 1))
      .limit(size)
      .sort({ createdAt: 'desc' });

    // Keeping this code to adjust product quantities caused by previous bug
    // const remianingQty = productQuantities.reduce(
    // 	(prev, curr) => prev + curr.remaining_qty,
    // 	0
    // );
    // await Product.updateOne({ _id: product_id }, { qty: remianingQty });

    const adjustmentIds = productQuantities.map((pq) => pq._id);

    const reduceLogCounts = await ReduceQtyLogs.aggregate([
      {
        $match: {
          adjustment_id: { $in: adjustmentIds },
        },
      },
      {
        $group: {
          _id: '$adjustment_id',
          count: { $sum: 1 },
        },
      },
    ]);

    const logCountMap = new Map<string, number>();
    reduceLogCounts.forEach((log) => {
      logCountMap.set(log._id.toString(), log.count);
    });

    const enrichedProductQuantities = productQuantities.map((pq) => ({
      ...pq.toObject(),
      history_count: logCountMap.get(pq._id.toString()) || 0,
    }));

    res.status(200).json({
      total_pages: totalPages,
      total_rows: totalCount,
      from: fromItem,
      to: toItem > totalCount ? totalCount : toItem,
      product_quantities: enrichedProductQuantities,
    });
  } catch (error) {
    res.status(400).json({ error });
  }
};
