import { CustomLoader, Layout, ProductForm } from "@/components";
import useUpdateProduct from "@/hooks/useUpdateProduct";

const UpdateProduct = () => {
	const {
		isLoading,
		productData,
		handleChange,
		handleUpdateProduct,
		handlePrintBarcode,
		setProductData,
		apiData
	} = useUpdateProduct();

	return (
		<Layout headerTitle='Update Product' buttonLink='/products' buttonLabel='Products'>
			<CustomLoader isLoading={isLoading} />

			<ProductForm
				onChange={handleChange(setProductData)}
				data={productData}
				handleSubmit={handleUpdateProduct}
				handlePrintBarcode={handlePrintBarcode}
				skuDisabled={true}
				submitBtnDisabled={isLoading || JSON.stringify(productData) === JSON.stringify(apiData)}
			/>
		</Layout>
	);
};

export default UpdateProduct;
