import { CustomLoader, Layout } from "@/components";
import BillForm from "../../components/custom/BillForm";
import useUpdateBill from "../../hooks/useUpdateBill";

const UpdateBill: React.FC = () => {
	const {
		billData,
		setBillData,
		items,
		setItems,
		handleChange,
		addItem,
		updateItem,
		removeItem,
		handleSubmit,
		billLoading,
		billError,
		vendors,
		vendorsLoading,
		updateLoading,
		updateError,
		updateSuccess,
	} = useUpdateBill();
	if (billLoading || vendorsLoading) return <CustomLoader isLoading={true} />;
	if (billError) return <div>Error loading bill: {String(billError)}</div>;

	return (
		<Layout headerTitle='Update Bill' buttonLabel='Bills' buttonLink='/bills'>
			<CustomLoader isLoading={updateLoading} />

			{updateError && (
				<div style={{ color: "red", marginBottom: 12 }}>
					Update failed: {String(updateError)}
				</div>
			)}

			{updateSuccess && (
				<div style={{ color: "green", marginBottom: 12 }}>
					Bill updated successfully!
				</div>
			)}
			<BillForm
				data={billData}
				setBillData={setBillData}
				items={items}
				setItems={setItems}
				onChange={handleChange}
				addItem={addItem}
				updateItem={updateItem}
				removeItem={removeItem}
				handleCheckout={handleSubmit}
				vendors={vendors || []}
				isVendorsLoading={vendorsLoading}
				isUpdate={true}
			/>
		</Layout>
	);
};
export default UpdateBill;
