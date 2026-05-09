import { CustomLoader, Layout, VendorForm } from '@/components';
import useAddVendor from '@/hooks/useAddVendor';
import { TVendor } from '@/types/Vendor';

const AddVendor = () => {
  const {
    isLoading,
    vendorData,
    setVendorData,
    handleAddVendor,
    handleCancel,
  } = useAddVendor();

  const handleChange = (setter: (data: Partial<TVendor>) => void) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setter({ ...vendorData, [event.target.name]: event.target.value });
  };

  return (
    <Layout headerTitle='Add Vendor' buttonLabel='Vendors' buttonLink='/vendors'>
      <CustomLoader isLoading={isLoading} />

      <VendorForm
        vendorData={vendorData}
        setVendorData={setVendorData}
        handleChange={handleChange}
        handleSubmit={() => handleAddVendor(vendorData)}
        handleCancel={handleCancel}
        isUpdate={false}
      />
    </Layout>
  );
};
export default AddVendor;
