import { CustomLoader, Layout, PageHeader, ProductForm } from '@/components';
import useAddProduct from '@/hooks/useAddProduct';

const AddProduct = () => {
  const {
    isLoading,
    productData,
    handleChange,
    handleAddProduct,
    handlePrintBarcode,
    setProductData,
    navigate,
  } = useAddProduct();

  return (
    <Layout>
      <CustomLoader isLoading={isLoading} />

      <PageHeader
        heading='Add Product'
        isbackIcon={true}
        backButtonText='Products'
        onClickBack={() => navigate('/products')}
      />

      <ProductForm
        onChange={handleChange(setProductData)}
        data={productData}
        handleSubmit={handleAddProduct}
        handlePrintBarcode={handlePrintBarcode}
        submitBtnDisabled={isLoading}
      />
    </Layout>
  );
};

export default AddProduct;
