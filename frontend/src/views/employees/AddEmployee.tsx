import { CustomLoader, Layout } from "@/components";
import EmployeeForm from "@/components/custom/EmployeeForm";
import useAddEmployee from "@/hooks/useAddEmployee";

const AddEmployee = () => {
	const {
		isLoading,
		employeeData,
		setEmployeeData,
		handleChange,
		handleCancel,
		errors,
		employeeStatusOptions,
		handleFormSubmit,
		handleStatusInputChange,
		handleStatusSelect,
		workingHours,
		handleDayToggle,
		handleTimeChange,
	} = useAddEmployee();

	return (
		<Layout
			headerTitle='Add Employee'
			buttonLabel='Employees'
			buttonLink='/employees'
		>
			<CustomLoader isLoading={isLoading} />

			<EmployeeForm
				employeeData={employeeData}
				setEmployeeData={setEmployeeData}
				errors={errors}
				employeeStatusOptions={employeeStatusOptions}
				handleChange={handleChange}
				handleSubmit={handleFormSubmit}
				handleStatusInputChange={handleStatusInputChange}
				handleStatusSelect={handleStatusSelect}
				handleCancel={handleCancel}
				workingHours={workingHours}
				handleDayToggle={handleDayToggle}
				handleTimeChange={handleTimeChange}
			/>
		</Layout>
	);
};

export default AddEmployee;
