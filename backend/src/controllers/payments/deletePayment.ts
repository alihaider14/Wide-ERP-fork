import { Request, Response } from "express";
import Payment from "~/models/payment";
import Vendor from "~/models/vendor";
import { validateWithZod } from "~/utils/errorHandling";
import { deletePaymentSchema } from "~/validations/payment.schema";

export const deletePayment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { payment_id } = await validateWithZod(deletePaymentSchema, req.params);

    const payment = await Payment.findById(payment_id);
    if (!payment) {
      res.status(404).json({ message: "Payment not found." });
      return;
    }

    await Vendor.findByIdAndUpdate(payment.vendor_id, {
      $inc: { to_pay: payment.paid_amount },
    });

    await payment.deleteOne();

    res.status(200).json({
      message: "Payment has been deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      error: "Server error",
      message: error instanceof Error ? error.message : String(error),
    });
  }
};
