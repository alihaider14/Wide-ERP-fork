import mongoose, { Types } from 'mongoose';
import { createBillSchema } from '~/validations/bill.schema';
import { validateWithZod } from '~/utils/errorHandling';
import { Response } from 'express';
import { TAuthenticatedRequest } from '~/types/express';
import Bill from '~/models/bill';
import Vendor from '~/models/vendor';
import ProductsQuantity from '~/models/products_quantity';
import Product from '~/models/product';
import Counter from '~/models/counter';
import { BillItemInput } from '~/types/bill';
import { logActivity } from '~/services/activity-logger.service';
import User from '~/models/user';
import { createBillDateInput } from '~/helper/bill-date-input';

export const createBill = async (req: TAuthenticatedRequest, res: Response) => {
  try {
    const validatedData = await validateWithZod(createBillSchema, req.body);
    const { vendor, bill_date, items } = validatedData;

    const billDateUtc = createBillDateInput(bill_date);

    const counter = await Counter.findByIdAndUpdate(
      "bill_no",
      { $inc: { sequence_value: 1 } },
      { new: true, upsert: true },
    );
    const bill_no = counter.sequence_value;

    let amount = 0;
    let totalItems = 0;
    (items as BillItemInput[]).forEach((item) => {
      amount += item.cost * item.qty;
      totalItems += item.qty;
    });

    const bill = await Bill.create({
      bill_no,
      vendor: new mongoose.Types.ObjectId(vendor),
      amount,
      items: totalItems,
      bill_date: billDateUtc,
    });

    await Promise.all(
      (items as BillItemInput[]).map((item) =>
        ProductsQuantity.create({
          bill_id: bill._id,
          product_id: item.product,
          cost: item.cost,
          quantity: item.qty,
          remaining_qty: item.qty,
          reason: "Added from bill",
          created_by: req.user?._id,
        }),
      ),
    );

    await Vendor.findByIdAndUpdate(vendor, {
      $inc: { to_pay: amount },
    });

    await Promise.all(
      (items as BillItemInput[]).map((item) =>
        Product.findByIdAndUpdate(item.product, {
          $inc: { qty: item.qty },
        }),
      ),
    );

    const vendorDoc = await Vendor.findById(vendor);

    const userId = req.user?._id;
    if (userId) {
      const user = await User.findById(userId);
      await logActivity({
        type: 'create_bill',
        moduleID: bill._id as Types.ObjectId,
        activity: `Bill #${bill.bill_no} created by ${user?.full_name || 'User'} for vendor ${vendorDoc?.full_name || 'Unknown'}.`,
        activistId: userId,
      });
    }

    res.status(201).json({
      _id: bill._id,
      bill_no: bill.bill_no,
      vendor: vendorDoc ? vendorDoc.full_name : '',
      vendor_id: bill.vendor,
      amount: bill.amount,
      items: bill.items,
      bill_date: bill.bill_date,
      created_at: bill.createdAt,
      updated_at: bill.updatedAt,
    });
  } catch (err) {
    res.status(500).json({
      error: 'Server error',
      message: err instanceof Error ? err.message : String(err),
      details: err,
    });
  }
};