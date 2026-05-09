import { Request, Response } from 'express';
import { FilterQuery } from 'mongoose';
import Bill, { IBill } from '~/models/bill';
import ProductsQuantity from '~/models/products_quantity';
import type { ProductView, VendorView } from '~/types/bill';
import Vendor from '~/models/vendor';
import { validateWithZod } from '~/utils/errorHandling';
import { getBillsSchema } from '~/validations/bill.schema';

export const getBills = async (req: Request, res: Response) => {
  try {
    const { pageNo, size, q, start_date, end_date } = await validateWithZod(
      getBillsSchema,
      req.query,
    );

    const filter: FilterQuery<IBill> = {};

    if (q) {
      const vendors = await Vendor.find(
        { full_name: { $regex: q, $options: 'i' } },
        '_id',
      );
      const vendorIds = vendors.map((v) => v._id);

      if (!isNaN(Number(q))) {
        filter.$or = [{ vendor: { $in: vendorIds } }, { bill_no: Number(q) }];
      } else {
        filter.vendor = { $in: vendorIds };
      }
    }

    if (start_date || end_date) {
      const billDateFilter: { $gte?: Date; $lte?: Date } = {};
      if (start_date) billDateFilter.$gte = new Date(`${start_date}T00:00:00.000Z`);
      if (end_date) billDateFilter.$lte = new Date(`${end_date}T23:59:59.999Z`);
      filter.bill_date = billDateFilter;
    }

    const totalCount = await Bill.countDocuments(filter);
    const totalPages = Math.ceil(totalCount / size);
    const to = size * pageNo;
    const from = to - (size - 1);

    const bills = await Bill.find(filter)
      .sort({ bill_no: 1 })
      .skip((pageNo - 1) * size)
      .limit(size)
      .populate<{ vendor: VendorView }>('vendor');

    const billsData = await Promise.all(
      bills.map(async (bill) => {
        const items = await ProductsQuantity.find({ bill_id: bill._id })
          .populate<{ product_id: ProductView }>('product_id');

        return {
          _id: bill._id,
          bill_no: bill.bill_no,
          vendor: { _id: bill.vendor._id, name: bill.vendor.full_name },
          amount: bill.amount,
          items: items.map((item) => ({
            product: item.product_id._id,
            sku: item.product_id.sku || '',
            cost: item.cost,
            qty: item.quantity,
            total_price: item.cost * item.quantity,
            remaining_qty: item.remaining_qty,
          })),
          bill_date: bill.bill_date,
          createdAt: bill.createdAt,
          updatedAt: bill.updatedAt,
        };
      }),
    );

    const todayStr = new Date().toISOString().slice(0, 10);
    const todayBills = await Bill.find({
      ...filter,
      createdAt: {
        $gte: new Date(`${todayStr}T00:00:00.000Z`),
        $lte: new Date(`${todayStr}T23:59:59.999Z`),
      },
    });

    const today_purchasing = todayBills.reduce(
      (sum, bill) => sum + (Number(bill.amount) || 0),
      0,
    );

    res.json({
      bills: billsData,
      total_pages: totalPages,
      total_rows: totalCount,
      from,
      to: to > totalCount ? totalCount : to,
      today_purchasing,
    });

  } catch (err) {
    res.status(500).json({
      error: 'Server error',
      message: err instanceof Error ? err.message : String(err),
      details: err,
    });
  }
};