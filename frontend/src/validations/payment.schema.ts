import { format, isValid, parse } from "date-fns";
import { z } from "zod";
import { PAYMENT_DATE_FORMAT } from "@/constant/Date";
const paymentDateRegex = /^([A-Za-z]{3})\s([A-Za-z]{3})\s(\d{2}),\s?(\d{4})$/;

const parsePaymentDateWithReason = (value: string): { parsed?: Date; error?: string } => {
  const trimmed = value.trim();
  const match = trimmed.match(paymentDateRegex);
  if (!match) {
    return { error: "Paid At must be in format: Mon Feb 23, 2026" };
  }

  const [, weekdayText, monthText, dayText, yearText] = match;
  const normalizedInput = `${weekdayText} ${monthText} ${dayText}, ${yearText}`;
  const parsed = parse(normalizedInput, PAYMENT_DATE_FORMAT, new Date());

  if (!isValid(parsed) || format(parsed, "MMM dd, yyyy") !== `${monthText} ${dayText}, ${yearText}`) {
    return { error: "Paid At is not a valid calendar date" };
  }

  const actualWeekday = format(parsed, "EEE");
  if (actualWeekday !== weekdayText) {
    return { error: "Weekday does not match date" };
  }

  return { parsed };
};

export const parsePaymentDisplayDate = (value: string) => {
  return parsePaymentDateWithReason(value).parsed;
};

export const formatPaymentDisplayDate = (date: Date): string => {
  return format(date, PAYMENT_DATE_FORMAT);
};

const strictPaymentDateSchema = z
  .string()
  .trim()
  .min(1, "Paid At is required")
  .superRefine((value, ctx) => {
    const result = parsePaymentDateWithReason(value);
    if (result.error) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: result.error,
      });
    }
  });

export const createPaymentSchema = z.object({
  vendor_id: z.string().trim().min(1, "Vendor is required"),
  paid_amount: z
    .number({
      required_error: "Paid Amount is required",
      invalid_type_error: "Paid Amount is required",
    })
    .positive("Paid Amount must be greater than 0"),
  paid_at: strictPaymentDateSchema,
  note: z.string().optional(),
});

export const updatePaymentSchema = z.object({
  _id: z.string().trim().min(1, "Payment ID is required"),
  vendor_id: z.string().trim().min(1, "Vendor is required"),
  paid_amount: z
    .number({
      required_error: "Paid Amount is required",
      invalid_type_error: "Paid Amount is required",
    })
    .positive("Paid Amount must be greater than 0"),
  paid_at: strictPaymentDateSchema,
  note: z.string().optional(),
});

export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;
export type UpdatePaymentInput = z.infer<typeof updatePaymentSchema>;
