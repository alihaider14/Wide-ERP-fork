import { CustomLoader, Layout, PaymentForm } from "@/components";
import useUpdatePayment from "@/hooks/useUpdatePayment";

const UpdatePayment = () => {
  const {
    isLoading,
    paymentData,
    setPaymentData,
    handleUpdatePayment,
    handleCancel,
    vendors,
    vendorsLoading,
  } = useUpdatePayment();

  return (
    <Layout headerTitle='Update Payment' buttonLabel='Payments' buttonLink='/payments'>
      <CustomLoader isLoading={isLoading} />

      <PaymentForm
        paymentData={paymentData}
        setPaymentData={setPaymentData}
        handleSubmit={() => handleUpdatePayment(paymentData)}
        handleCancel={handleCancel}
        vendors={vendors}
        vendorsLoading={vendorsLoading}
      />
    </Layout>
  );
};

export default UpdatePayment;
