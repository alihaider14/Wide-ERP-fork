import { Input } from "../ui/input";
import { Label } from "../ui/label";
import CustomAutocomplete from "./CustomAutocomplete";
import CustomDatePicker from "./CustomDatePicker";
import { COLOR } from "@/constant/Colors";
import { PAYMENT_DATE_FORMAT } from "@/constant/Date";
import {
  formatPaymentDisplayDate,
  parsePaymentDisplayDate,
} from "@/validations/payment.schema";
import FormActionButtons from "./FormActionButtons";

type PaymentFormData = {
  vendor_id?: string;
  paid_amount?: number;
  paid_at?: string;
  note?: string;
  payment_no?: number;
};

type VendorOption = {
  _id?: string;
  full_name: string;
  to_pay?: number;
};

type PaymentFormProps = {
  paymentData: PaymentFormData;
  setPaymentData: (data: PaymentFormData) => void;
  handleSubmit: () => void;
  handleCancel?: () => void;
  vendors: VendorOption[];
  vendorsLoading?: boolean;
};

const PaymentForm = ({
  paymentData,
  setPaymentData,
  handleSubmit,
  handleCancel,
  vendors,
  vendorsLoading,
}: PaymentFormProps) => {
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit();
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="max-w-[1190px] w-auto flex flex-col gap-[30px] bg-white p-10 rounded-[4px] border"
        style={{ borderColor: COLOR.borderColor }}>
        {paymentData?.payment_no && (
          <div className="h-[21px] font-poppins text-[14px] leading-[14px] flex items-center gap-1" 
           style={{ color: COLOR.semiBlack }}>
            <span className="font-normal">You're editing</span>
            <span className="font-medium">
              P. No. {paymentData.payment_no}
            </span>
          </div>
        )}

        <div className="flex gap-[30px]">
          <div className="w-[540px] h-[58px] flex flex-col gap-1">
            <Label>
              Vendor <span className="text-red-500">*</span>
            </Label>
            <CustomAutocomplete
              className="w-full"
              data={
                vendors?.map((vendor) => ({
                  id: vendor._id || "",
                  name: vendor.full_name,
                })) || []
              }
              placeholder="Vendor"
              name="vendor_id"
              disabled={vendorsLoading}
              value={paymentData?.vendor_id || ""}
              handleSelect={(item) => {
                setPaymentData({
                  ...paymentData,
                  vendor_id: String(item.id),
                });
              }}
            />
          </div>
          <div className="w-[540px] h-[58px] flex flex-col gap-1">
            <Label>
              Paid Amount <span className="text-red-500">*</span>
            </Label>
            <Input
              placeholder="Paid Amount"
              name="paid_amount"
              type="text"
              value={paymentData?.paid_amount ?? ""}
              onChange={(e) => {
                let val = e.target.value.replace(/[^\d.]/g, "");
                const parts = val.split(".");
                if (parts.length > 2) {
                  val = parts[0] + "." + parts.slice(1).join("");
                }
                const numVal = val === "" ? undefined : Number(val);
                setPaymentData({ ...paymentData, paid_amount: numVal });
              }}
              className="pl-4"
            />
          </div>
        </div>

        <div className="flex gap-[30px]">
          <div className="w-[540px] h-[58px] flex flex-col gap-1">
            <CustomDatePicker
              name="paid_at"
              label="Paid At"
              required
              className="w-full"
              placeholder="Mon Feb 23, 2026"
              displayFormat={PAYMENT_DATE_FORMAT}
              date={paymentData?.paid_at ? parsePaymentDisplayDate(paymentData.paid_at) || undefined : undefined}
              onDateChange={(date) => {
                const formatted = formatPaymentDisplayDate(date);
                setPaymentData({ ...paymentData, paid_at: formatted });
              }}
            />
          </div>
          <div className="w-[540px] h-[58px]">
            <Input
              label="Note"
              placeholder="Note"
              name="note"
              type="text"
              value={paymentData?.note ?? ""}
              onChange={(e) =>
                setPaymentData({ ...paymentData, note: e.target.value })
              }
              className="pl-4"
            />
          </div>
        </div>

        <div className="sm:col-span-2 flex justify-end items-center gap-[30px] max-w-[1110px] w-auto h-9">
          <FormActionButtons onCancel={handleCancel} submitType="submit" />
        </div>
      </div>
    </form>
  );
};

export default PaymentForm;
