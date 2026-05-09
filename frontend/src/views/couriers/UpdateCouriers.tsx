import { CustomLoader, Layout, CourierForm } from "@/components";
import useUpdateCourier from "@/hooks/useUpdateCourier";

const UpdateCourier = () => {
	const {
		isLoading,
		courierData,
		setCourierData,
		handleChange,
		handleUpdateCourier,
		handleCancel,
		shops,
		shopsLoading,
	} = useUpdateCourier();

	return (
		<Layout
			headerTitle='Update Courier'
			buttonLabel='Couriers'
			buttonLink='/couriers'
		>
			<CustomLoader isLoading={isLoading} />
			<CourierForm
				courierData={courierData}
				setCourierData={setCourierData}
				onChange={handleChange(setCourierData)}
				handleSubmit={handleUpdateCourier}
				handleCancel={handleCancel}
				isUpdate={true}
				shops={shops}
				shopsLoading={shopsLoading}
			/>
		</Layout>
	);
};

export default UpdateCourier;
