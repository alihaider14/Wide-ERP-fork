import { CustomLoader, ProductQtyForm, Layout, PageHeader } from "@/components";
import useUpdateAdjustQuantity from "@/hooks/useUpdateAdjustQuantity";

const UpdateAdjustQuantity = () => {
	const {
		isLoading,
		productQtyData,
		sku,
		_id,
		setProductQtyData,
		handleChange,
		handleUpdateAdjustQty,
		navigate,
	} = useUpdateAdjustQuantity();

	return (
		<Layout>
			<CustomLoader isLoading={isLoading} />

			<PageHeader
				heading={`${sku || "<SKU>"} - Update Quantity`}
				isbackIcon={true}
				backButtonText='Adjust Quantity'
				onClickBack={() => navigate(`/adjust-quantities/${_id}`)}
			/>

			<ProductQtyForm
				onChange={handleChange(setProductQtyData)}
				data={productQtyData}
				handleSumbit={handleUpdateAdjustQty}
				isLoading={isLoading}
				handleCancel={() => navigate(`/adjust-quantities/${_id}`)}
				isDisabled
			/>
		</Layout>
	);
};
export default UpdateAdjustQuantity;
