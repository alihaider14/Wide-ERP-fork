import { Response } from 'express';
import Bill from '~/models/bill';
import Product from '~/models/product';
import ProductsQuantity from '~/models/products_quantity';
import Vendor from '~/models/vendor';
import { validateWithZod } from '~/utils/errorHandling';
import { getBillItemsSchema } from '~/validations/bill.schema';
import { logActivity } from '~/services/activity-logger.service';
import User from '~/models/user';
import { TAuthenticatedRequest } from '~/types/express';
import { Types } from 'mongoose';

export const deleteBill = async (
  req: TAuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { bill_id } = await validateWithZod(getBillItemsSchema, req.params);
    
    const bill = await Bill.findById(bill_id);
    if (!bill) {
      res.status(404).json({ message: 'Bill not found.' });
      return;
    }

    const billItems = await ProductsQuantity.find({ bill_id: bill._id });
    
    if (billItems.length === 0) {
      res.status(400).json({ 
        error: 'No bill items found for this bill.' 
      });
      return;
    }

    const usedItems = billItems.filter(
      item => item.remaining_qty !== item.quantity
    );

    if (usedItems.length > 0) {
      res.status(400).json({
        error: "This bill can't be deleted because some of its items have already been used."
      });
      return;
    }

    const vendor = await Vendor.findById(bill.vendor);
    const vendorName = vendor?.full_name || 'Unknown Vendor';

    await Vendor.findByIdAndUpdate(bill.vendor, {
      $inc: { to_pay: -bill.amount }
    });

    await Promise.all(
      billItems.map(item =>
        Product.findByIdAndUpdate(item.product_id, {
          $inc: { qty: -item.quantity }
        })
      )
    );

    await ProductsQuantity.deleteMany({ bill_id: bill._id });

    const userId = req.user?._id;
    if (userId) {
      const user = await User.findById(userId);
      await logActivity({
        type: 'delete_bill',
        moduleID: bill._id as Types.ObjectId,
        activity: `Bill #${bill.bill_no} deleted by ${user?.full_name || 'User'}.`,
        activistId: userId,
      });
    }

    await bill.deleteOne();

    res.status(200).json({
      message: `Bill from the ${vendorName} has been deleted.`
    });
    
  } catch (error) {
    res.status(500).json({
      error: 'Server error',
      message: error instanceof Error ? error.message : String(error)
    });
  }
};
