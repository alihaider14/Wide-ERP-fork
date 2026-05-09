import { CustomLoader, Layout, CourierForm } from "@/components";
import useAddCourier from "@/hooks/useAddCourier";

const AddCourier = () => {
	const {
		isLoading,
		courierData,
		setCourierData,
		handleChange,
		handleAddCourier,
		handleCancel,
		shops,
		shopsLoading,
	} = useAddCourier();

	return (
		<Layout
			headerTitle='Add Courier'
			buttonLabel='Couriers'
			buttonLink='/couriers'
		>
			<CustomLoader isLoading={isLoading} />

			<CourierForm
				courierData={courierData}
				onChange={handleChange(setCourierData)}
				handleSubmit={() => handleAddCourier(courierData)}
				handleCancel={handleCancel}
				isUpdate={false}
				shops={shops}
				shopsLoading={shopsLoading}
				setCourierData={setCourierData}
			/>
		</Layout>
	);
};
export default AddCourier;
