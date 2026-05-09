import { CustomLoader, Layout, Prompt } from "@/components";
import BillForm from "@/components/custom/BillForm";
import useAddBill from "@/hooks/useAddBill";
import useVendors from "@/hooks/useVendors";
import { useNavigate } from "react-router-dom";

const AddBill = () => {
	const navigate = useNavigate();
	const {
		prompt,
		items,
		billData,
		loading,
		setPrompt,
		addItem,
		updateItem,
		setBillData,
		handleChange,
		handleAddBill,
		removeItem,
		setItems,
	} = useAddBill();
	const { vendorsData, isTableLoader: isVendorsLoading } = useVendors();

	return (
		<Layout headerTitle='Add Bill' buttonLabel='Bills' buttonLink='/bills'>
			<CustomLoader isLoading={loading} />

			<Prompt
				open={prompt}
				title='Back to Bills'
				description='Are you sure you want to leave? Unsaved changes will be lost.'
				handleSumbit={() => {
					setPrompt(false);
					navigate("/bills");
				}}
				handleCancel={() => setPrompt(false)}
				cancelButtonText='Cancel'
				sumbitButtonText='Yes, leave'
			/>

			<BillForm
				items={items}
				addItem={addItem}
				updateItem={updateItem}
				removeItem={removeItem}
				setItems={setItems}
				data={billData}
				onChange={handleChange}
				setBillData={setBillData}
				handleCheckout={handleAddBill}
				vendors={vendorsData}
				isVendorsLoading={isVendorsLoading}
			/>
		</Layout>
	);
};

export default AddBill;
