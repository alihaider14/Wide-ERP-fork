import { CustomLoader, Layout, VendorForm } from "@/components";
import useUpdateVendor from "@/hooks/useUpdateVendor";
import { TVendor } from '@/types/Vendor';

const UpdateVendor = () => {
  const {
    isLoading,
    vendorData,
    setVendorData,
    handleUpdateVendor,
    handleCancel,
  } = useUpdateVendor();

  const handleChange = (setter: (data: Partial<TVendor>) => void) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setter({ ...vendorData, [event.target.name]: event.target.value });
  };

  return (
    <Layout headerTitle='Update Vendor' buttonLabel='Vendors' buttonLink='/vendors'>
      <CustomLoader isLoading={isLoading} />
      <VendorForm
        vendorData={vendorData}
        setVendorData={setVendorData}
        handleChange={handleChange}
        handleSubmit={handleUpdateVendor}
        handleCancel={handleCancel}
        isUpdate={true}
      />
    </Layout>
  );
};

export default UpdateVendor;
