import { CustomLoader, Layout, PaymentForm } from "@/components";
import useAddPayment from "@/hooks/useAddPayment";

const AddPayment = () => {
  const {
    isLoading,
    paymentData,
    setPaymentData,
    handleAddPayment,
    handleCancel,
    vendors,
    vendorsLoading,
  } = useAddPayment();

  return (
    <Layout headerTitle="Add Payment" buttonLabel="Payments" buttonLink="/payments">
      <CustomLoader isLoading={isLoading} />

      <PaymentForm
        paymentData={paymentData}
        setPaymentData={setPaymentData}
        handleSubmit={() => handleAddPayment(paymentData)}
        handleCancel={handleCancel}
        vendors={vendors}
        vendorsLoading={vendorsLoading}
      />
    </Layout>
  );
};

export default AddPayment;
