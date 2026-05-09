import { Request, Response } from "express";
import { validateWithZod } from "~/utils/errorHandling";
import { getPaymentsSchema } from "~/validations/payment.schema";
import Payment from "~/models/payment";
import Vendor from "~/models/vendor";

export const getPayments = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const validatedData = await validateWithZod(getPaymentsSchema, req.query);

    const page = req.query.pageNo ? Number(req.query.pageNo) : validatedData.page;
    const size = validatedData.size;
    const q = validatedData.q;
    const startDate = validatedData.start_date;
    const endDate = validatedData.end_date;

    const filter: {
      paid_at?: { $gte?: Date; $lte?: Date };
      $or?: Array<{ payment_no: number } | { paid_amount: number }>;
      vendor_id?: { $in: unknown[] };
    } = {};

    if (startDate || endDate) {
      filter.paid_at = {};
      if (startDate) {
        const start = new Date(startDate);
        start.setUTCHours(0, 0, 0, 0);
        filter.paid_at.$gte = start;
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setUTCHours(23, 59, 59, 999);
        filter.paid_at.$lte = end;
      }
    }

    if (q) {
      const numericQ = Number(q);
      if (!isNaN(numericQ)) {
        filter.$or = [
          { payment_no: numericQ },
          { paid_amount: numericQ },
        ];
      } else {
        const matchingVendors = await Vendor.find(
          { full_name: { $regex: q, $options: "i" } },
          { _id: 1 }
        );
        const vendorIds = matchingVendors.map((v) => v._id);
        filter.vendor_id = { $in: vendorIds };
      }
    }

    const totalCount = await Payment.countDocuments(filter);

    const queryOptions = {
      skip: size * (page - 1),
      limit: size,
    };

    const totalPages = Math.ceil(totalCount / size);
    const to = size * page;
    const from = to - (size - 1);

    const payments = await Payment.find(filter, {}, queryOptions)
      .sort({ updatedAt: -1 })
      .populate("vendor_id", "full_name");

    const formattedPayments = payments.map((payment) => {
      const populatedVendor = payment.vendor_id && "full_name" in payment.vendor_id
      ? payment.vendor_id : null;

      return {
        _id: payment._id,
        payment_no: payment.payment_no,
        vendor_id: populatedVendor?._id || payment.vendor_id,
        vendor_name: populatedVendor?.full_name || "",
        paid_amount: payment.paid_amount,
        current_balance: payment.current_balance,
        remaining_balance: payment.remaining_balance,
        paid_at: payment.paid_at,
        note: payment.note || "",
        createdAt: payment.createdAt,
        updatedAt: payment.updatedAt,
      };
    });

    res.status(200).json({
      total_pages: totalPages,
      total_rows: totalCount,
      from,
      to: to > totalCount ? totalCount : to,
      payments: formattedPayments,
    });
  } catch (error) {
    res.status(400).json({ error });
  }
};
