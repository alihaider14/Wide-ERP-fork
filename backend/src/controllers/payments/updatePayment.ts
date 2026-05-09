import { Response } from "express";
import mongoose from "mongoose";
import Payment from "~/models/payment";
import Vendor from "~/models/vendor";
import { TAuthenticatedRequest } from "~/types/express";
import { validateWithZod } from "~/utils/errorHandling";
import { updatePaymentSchema } from "~/validations/payment.schema";

export const updatePayment = async (
  req: TAuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const validatedData = await validateWithZod(updatePaymentSchema, req.body);
    const { _id, vendor_id, paid_amount, paid_at, note } = validatedData;

    const existingPayment = await Payment.findById(_id);
    if (!existingPayment) {
      res.status(404).json({ error: "Payment not found" });
      return;
    }

    const isVendorChanged = String(existingPayment.vendor_id) !== vendor_id;
    const oldPaidAmount = Number(existingPayment.paid_amount);
    const newPaidAmount = Number(paid_amount);

    const vendorDoc = await Vendor.findById(vendor_id);
    if (!vendorDoc) {
      res.status(404).json({ error: "Vendor not found" });
      return;
    }

    const current_balance = isVendorChanged
      ? Number(vendorDoc.to_pay ?? 0)
      : Number(vendorDoc.to_pay ?? 0) + oldPaidAmount;
    const remaining_balance = current_balance - newPaidAmount;
    const parsedPaidAt = new Date(paid_at);
    if (isNaN(parsedPaidAt.getTime())) {
      res.status(400).json({ error: "Invalid paid_at date" });
      return;
    }
    const normalizedPaidAt = new Date(
      Date.UTC(
        parsedPaidAt.getUTCFullYear(),
        parsedPaidAt.getUTCMonth(),
        parsedPaidAt.getUTCDate()
      )
    );

    const updatedPayment = await Payment.findByIdAndUpdate(
      _id,
      {
        $set: {
          vendor_id: new mongoose.Types.ObjectId(vendor_id),
          paid_amount: newPaidAmount,
          current_balance,
          remaining_balance,
          paid_at: normalizedPaidAt,
          note: note || "",
        },
      },
      { new: true }
    );

    if (isVendorChanged) {
      await Promise.all([
        Vendor.findByIdAndUpdate(existingPayment.vendor_id, {
          $inc: { to_pay: oldPaidAmount },
        }),
        Vendor.findByIdAndUpdate(vendor_id, {
          $inc: { to_pay: -newPaidAmount },
        }),
      ]);
    } else {
      await Vendor.findByIdAndUpdate(vendor_id, {
        $inc: { to_pay: oldPaidAmount - newPaidAmount },
      });
    }

    res.status(200).json({
      _id: updatedPayment?._id,
      payment_no: updatedPayment?.payment_no,
      vendor_id: updatedPayment?.vendor_id,
      vendor_name: vendorDoc ? vendorDoc.full_name : "",
      paid_amount: updatedPayment?.paid_amount,
      current_balance: updatedPayment?.current_balance,
      remaining_balance: updatedPayment?.remaining_balance,
      paid_at: updatedPayment?.paid_at,
      note: updatedPayment?.note || "",
      createdAt: updatedPayment?.createdAt,
      updatedAt: updatedPayment?.updatedAt,
    });
  } catch (error) {
    res.status(500).json({
      error: "Server error",
      message: error instanceof Error ? error.message : String(error),
      details: error,
    });
  }
};
