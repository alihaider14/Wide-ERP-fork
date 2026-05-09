import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useVendors from "./useVendors";
import { handleApiError } from "@/helper/error-function";
import { TError } from "@/types/TError";
import { createPayment } from "@/services/payment-service";
import { PaymentFormData } from "@/types/payment";
import {
  createPaymentSchema,
  formatPaymentDisplayDate,
  parsePaymentDisplayDate,
} from "@/validations/payment.schema";
import { format } from "date-fns";

const useAddPayment = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { vendorsData: vendors, isTableLoader: vendorsLoading } = useVendors();
  const [loading, setLoading] = useState(false);
  const [paymentData, setPaymentData] = useState<PaymentFormData>({
    vendor_id: "",
    paid_amount: undefined,
    paid_at: formatPaymentDisplayDate(new Date()),
    note: "",
  });

  const addPaymentMutation = useMutation({
    mutationFn: createPayment,
    onSuccess: () => {
      toast.success("Payment added successfully.");
      setLoading(false);
      setPaymentData({
        vendor_id: "",
        paid_amount: undefined,
        paid_at: formatPaymentDisplayDate(new Date()),
        note: "",
      });
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      navigate("/payments");
    },
    onError: (error: TError) => {
      setLoading(false);
      handleApiError(error, "Failed to add payment. Please try again.");
    },
  });

  const handleAddPayment = (data: PaymentFormData) => {
    const parseResult = createPaymentSchema.safeParse(data);
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
    addPaymentMutation.mutate({
      vendor_id: parseResult.data.vendor_id,
      paid_amount: Number(parseResult.data.paid_amount),
      paid_at: format(parsedDate, "yyyy-MM-dd"),
      note: parseResult.data.note || "",
    });
  };

  const handleCancel = () => {
    navigate("/payments");
  };

  const isLoading = loading || addPaymentMutation.isPending;

  return {
    isLoading,
    paymentData,
    setPaymentData,
    handleAddPayment,
    handleCancel,
    vendors,
    vendorsLoading,
  };
};

export default useAddPayment;
