import { Request, Response } from 'express';
import Bill from '~/models/bill';
import ProductsQuantity from '~/models/products_quantity';
import type { ProductView, VendorView } from '~/types/bill';
import type { TValidationError } from '~/types/error';
import { getBillItemsSchema } from '~/validations/bill.schema';
import { validateWithZod } from '~/utils/errorHandling';

export const getBillById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await validateWithZod(getBillItemsSchema, { bill_id: id });

    const bill = await Bill.findById(id).populate<{ vendor: VendorView }>('vendor');

    if (!bill) {
      return res.status(404).json({ error: 'Bill not found' });
    }

    const items = await ProductsQuantity.find({ bill_id: id })
      .populate<{ product_id: ProductView }>('product_id');

    res.json({
      _id: bill._id,
      bill_no: bill.bill_no,
      vendor: bill.vendor.full_name,
      vendor_id: bill.vendor._id,
      amount: bill.amount,
      items: items
        .filter((item) => item.product_id)
        .map((item) => ({
          product: item.product_id._id,
          sku: item.product_id.sku || '',
          barcode: item.product_id.barcode || '',
          cost: item.cost,
          qty: item.quantity,
          remaining_qty: item.remaining_qty,
          total_price: item.cost * item.quantity,
        })),
      bill_date: bill.bill_date,
      created_at: bill.createdAt,
      updated_at: bill.updatedAt,
    });

  } catch (err: unknown) {
    const validationError = err as TValidationError;

    if (validationError?.validation) {
      return res.status(400).json({
        error:
          validationError.validation?.bill_id ||
          (err instanceof Error ? err.message : String(err)),
      });
    }

    return res.status(500).json({
      error: 'Server error',
      details: err instanceof Error ? err.message : String(err),
    });
  }
};