import {Response} from "express";
import {TAuthenticatedRequest} from "~/types/express";
import Bill from "~/models/bill";
import Product from "~/models/product";
import ProductsQuantity from "~/models/products_quantity";
import Vendor from "~/models/vendor";
import {updateBillSchema} from "~/validations/bill.schema";
import {BillItemInput} from "~/types/bill";
import {validateWithZod} from "~/utils/errorHandling";
import {logActivity} from "~/services/activity-logger.service";
import User from "~/models/user";
import {Types} from "mongoose";
import { createBillDateInput } from "~/helper/bill-date-input";

export const updateBill = async (req: TAuthenticatedRequest, res: Response) => {
  try {
    const validatedData = await validateWithZod(updateBillSchema, req.body);
    const {_id, vendor, bill_date, items} = validatedData;

    const billDateUtc = createBillDateInput(bill_date);

    const existingBill = await Bill.findById(_id);
    if (!existingBill) {
      return res.status(404).json({error: "Bill not found"});
    }

    const oldItems = await ProductsQuantity.find({bill_id: _id});
    const oldAmount = existingBill.amount;
    const oldVendor = existingBill.vendor;

    const itemsSoldMap = new Map<string, number>();
    oldItems.forEach((item) => {
      const itemsSold = item.quantity - item.remaining_qty;
      const productIdStr = item.product_id.toString();
      itemsSoldMap.set(
        productIdStr,
        (itemsSoldMap.get(productIdStr) || 0) + itemsSold
      );
    });

    for (const newItem of items as BillItemInput[]) {
      const productIdStr = newItem.product.toString();
      const oldItemsForProduct = oldItems.filter(
        (item) => item.product_id.toString() === productIdStr
      );
      
      if (oldItemsForProduct.length > 0) {
        const totalRemaining = oldItemsForProduct.reduce(
          (sum, item) => sum + item.remaining_qty,
          0
        );
        
        if (newItem.qty < totalRemaining) {
          return res.status(400).json({
            error: `Cannot reduce quantity below remaining stock. Product has ${totalRemaining} items remaining in stock.`,
          });
        }
      }
    }

    for (const oldItem of oldItems) {
      const productIdStr = oldItem.product_id.toString();
      const isInNewItems = (items as BillItemInput[]).some(
        (item) => item.product.toString() === productIdStr
      );
      
      if (!isInNewItems && oldItem.quantity !== oldItem.remaining_qty) {
        return res.status(400).json({
          error: `Cannot remove product that has sold items. Product has ${
            oldItem.quantity - oldItem.remaining_qty
          } items already sold.`,
        });
      }
    }

    await Vendor.findByIdAndUpdate(oldVendor, {
      $inc: {to_pay: -oldAmount},
    });

    await Promise.all(
      oldItems.map((item) =>
        Product.findByIdAndUpdate(item.product_id, {
          $inc: {qty: -item.quantity},
        }),
      ),
    );

    await ProductsQuantity.deleteMany({bill_id: _id});

    let amount = 0;
    let totalItems = 0;
    (items as BillItemInput[]).forEach((item) => {
      amount += item.cost * item.qty;
      totalItems += item.qty;
    });

    existingBill.vendor = vendor;
    existingBill.amount = amount;
    existingBill.items = totalItems;
    existingBill.bill_date = billDateUtc;
    await existingBill.save();

    await Promise.all(
      (items as BillItemInput[]).map((item) => {
        const productIdStr = item.product.toString();
        const itemsSold = itemsSoldMap.get(productIdStr) || 0;
        const newRemainingQty = Math.max(0, item.qty - itemsSold);
        
        return ProductsQuantity.create({
          bill_id: _id,
          product_id: item.product,
          cost: item.cost,
          quantity: item.qty,
          remaining_qty: newRemainingQty,
          reason: "Added from bill",
          created_by: req.user?._id,
        });
      }),
    );

    await Vendor.findByIdAndUpdate(vendor, {
      $inc: {to_pay: amount},
    });

    await Promise.all(
      (items as BillItemInput[]).map((item) =>
        Product.findByIdAndUpdate(item.product, {
          $inc: {qty: item.qty},
        }),
      ),
    );

    const vendorDoc = await Vendor.findById(vendor);

    const userId = req.user?._id;
    if (userId) {
      const user = await User.findById(userId);
      await logActivity({
        type: 'update_bill',
        moduleID: existingBill._id as Types.ObjectId,
        activity: `Bill #${existingBill.bill_no} updated by ${user?.full_name || 'User'}.`,
        activistId: userId,
      });
    }

    res.status(200).json({
      _id: existingBill._id,
      bill_no: existingBill.bill_no,
      vendor: vendorDoc ? vendorDoc.full_name : vendor,
      vendor_id: vendor,
      amount: existingBill.amount,
      items: existingBill.items,
      bill_date: existingBill.bill_date,
      created_at: existingBill.createdAt,
      updated_at: existingBill.updatedAt,
    });
  } catch (err) {
    res.status(500).json({error: "Server error", details: err});
  }
};
