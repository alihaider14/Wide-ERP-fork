import { Request, Response } from 'express';
import ProductsQuantity from '~/models/products_quantity';
import { validateWithZod } from '~/utils/errorHandling';
import { getBillItemsSchema } from '~/validations/bill.schema';
export const getBillItems = async (req: Request, res: Response) => {
  try {
    const { bill_id } = await validateWithZod(getBillItemsSchema, req.query);
    const items = await ProductsQuantity.find({ bill_id: bill_id });
    res.status(200).json(
      items.map((item) => ({
        _id: item._id,
        bill_id: item.bill_id,
        product: item.product_id,
        cost: item.cost,
        qty: item.quantity,
        remaining_qty: item.remaining_qty,
        total_cost: item.cost * item.quantity,
        created_at: item.createdAt,
        updated_at: item.updatedAt,
      }))
    );
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err });
  }
};
