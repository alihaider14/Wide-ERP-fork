import { Response } from "express";
import mongoose from "mongoose";
import { validateWithZod } from "~/utils/errorHandling";
import { createPaymentSchema } from "~/validations/payment.schema";
import Payment from "~/models/payment";
import Vendor from "~/models/vendor";
import { TAuthenticatedRequest } from "~/types/express";

export const createPayment = async (
  req: TAuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const validatedData = await validateWithZod(createPaymentSchema, req.body);
    const { vendor_id, paid_amount, paid_at, note } = validatedData;

    const vendorDoc = await Vendor.findById(vendor_id);
    if (!vendorDoc) {
      res.status(404).json({ error: "Vendor not found" });
      return;
    }

    const current_balance = Number(vendorDoc.to_pay ?? 0);
    const remaining_balance = current_balance - Number(paid_amount);
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

    const lastPayment = await Payment.findOne({}, {}, { sort: { payment_no: -1 } });
    const payment_no = lastPayment ? lastPayment.payment_no + 1 : 1;

    const payment = await Payment.create({
      payment_no,
      vendor_id: new mongoose.Types.ObjectId(vendor_id),
      paid_amount,
      current_balance,
      remaining_balance,
      paid_at: normalizedPaidAt,
      note: note || "",
    });

    await Vendor.findByIdAndUpdate(vendor_id, {
      $inc: { to_pay: -Number(paid_amount) },
    });

    res.status(201).json({
      _id: payment._id,
      payment_no: payment.payment_no,
      vendor_id: payment.vendor_id,
      vendor_name: vendorDoc ? vendorDoc.full_name : "",
      paid_amount: payment.paid_amount,
      current_balance: payment.current_balance,
      remaining_balance: payment.remaining_balance,
      paid_at: payment.paid_at,
      note: payment.note || "",
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,
    });
  } catch (error) {
    res.status(500).json({
      error: "Server error",
      message: error instanceof Error ? error.message : String(error),
      details: error,
    });
  }
};
