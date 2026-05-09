import { CustomLoader, ProductQtyForm, Layout } from "@/components";
import useAddAdjustQuantity from "@/hooks/useAddAdjustQuantity";

const AddAdjustQuantity = () => {
	const {
		isLoading,
		productQtyData,
		sku,
		_id,
		setProductQtyData,
		handleChange,
		handleAddAdjustQty,
		navigate,
	} = useAddAdjustQuantity();

	return (
		<Layout
			headerTitle={`[${sku || "SKU"}] - Add Quantity`}
			buttonLabel='Adjust Quantity'
			buttonLink={`/adjust-quantities/${_id}`}
		>
			<CustomLoader isLoading={isLoading} />

			<ProductQtyForm
				onChange={handleChange(setProductQtyData)}
				data={productQtyData}
				handleSumbit={handleAddAdjustQty}
				isLoading={isLoading}
				handleCancel={() => navigate(`/adjust-quantities/${_id}`)}
			/>
		</Layout>
	);
};
export default AddAdjustQuantity;
