import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import useVendors from "./useVendors";
import { updatePayment } from "@/services/payment-service";
import { handleApiError } from "@/helper/error-function";
import { TError } from "@/types/TError";
import { PaymentFormData, PaymentLocationState } from "@/types/payment";
import { format } from "date-fns";
import { PAYMENT_DATE_FORMAT } from "@/constant/Date";
import {
  parsePaymentDisplayDate,
  updatePaymentSchema,
} from "@/validations/payment.schema";
import { toStableLocalDate } from "@/helper/payment-date";

const useUpdatePayment = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { vendorsData: vendors, isTableLoader: vendorsLoading } = useVendors();
  const [loading, setLoading] = useState(false);
  const [paymentData, setPaymentData] = useState<PaymentFormData>({
    vendor_id: "",
    paid_amount: undefined,
    paid_at: "",
    note: "",
  });

  const paymentFromState = (location.state as PaymentLocationState | null)?.payment;

  useEffect(() => {
    if (!paymentFromState) return;

    const parsedPaidAt = paymentFromState.paid_at
      ? new Date(paymentFromState.paid_at)
      : undefined;

    setPaymentData({
      vendor_id: paymentFromState.vendor_id || "",
      paid_amount:
        paymentFromState.paid_amount !== undefined
          ? Number(paymentFromState.paid_amount)
          : undefined,
      paid_at:
        parsedPaidAt && !isNaN(parsedPaidAt.getTime())
          ? format(toStableLocalDate(parsedPaidAt), PAYMENT_DATE_FORMAT)
          : "",
      note: paymentFromState.note || "",
      payment_no: paymentFromState.payment_no,
    });
  }, [paymentFromState]);

  const updatePaymentMutation = useMutation({
    mutationFn: updatePayment,
    onSuccess: () => {
      toast.success("Payment updated successfully.");
      setLoading(false);
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      navigate("/payments");
    },
    onError: (error: TError) => {
      setLoading(false);
      handleApiError(error, "Failed to update payment. Please try again.");
    },
  });

  const handleUpdatePayment = (data: PaymentFormData) => {
    const parseResult = updatePaymentSchema.safeParse({
      _id: id,
      ...data,
    });
    if (!parseResult.success) {
      toast.error(parseResult.error.errors[0]?.message || "Validation error");
      return;
    }
    const parsedDate = parsePaymentDisplayDate(parseResult.data.paid_at);
    if (!parsedDate) {
      toast.error("Paid At must be in format: Mon Feb 23, 2026");
      return;
    }

    setLoading(true);
    updatePaymentMutation.mutate({
      _id: parseResult.data._id,
      vendor_id: parseResult.data.vendor_id,
      paid_amount: Number(parseResult.data.paid_amount),
      paid_at: format(parsedDate, "yyyy-MM-dd"),
      note: parseResult.data.note || "",
    });
  };

  const handleCancel = () => {
    navigate("/payments");
  };

  const isLoading = loading || updatePaymentMutation.isPending;

  return {
    isLoading,
    paymentData,
    setPaymentData,
    handleUpdatePayment,
    handleCancel,
    vendors,
    vendorsLoading,
  };
};

export default useUpdatePayment;
