import { CustomLoader, Layout } from "@/components";
import { DeletionConfirmation } from "@/components/custom/DeletionConfirmation";
import EmployeeForm from "@/components/custom/EmployeeForm";
import useUpdateEmployee from "@/hooks/useUpdateEmployee";

const UpdateEmployee = () => {
	const {
		isLoading,
		isDeleting,
		employeeData,
		setEmployeeData,
		handleChange,
		handleDeleteEmployee,
		handleCancel,
		deleteOpen,
		setDeleteOpen,
		handleOpenDelete,
		errors,
		employeeStatusOptions,
		handleFormSubmit,
		handleStatusInputChange,
		handleStatusSelect,
		workingHours,
		handleDayToggle,
		handleTimeChange,
	} = useUpdateEmployee();

	return (
		<Layout
			headerTitle='Update Employee'
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
				handleDelete={handleOpenDelete}
				handleCancel={handleCancel}
				isUpdate
				workingHours={workingHours}
				handleDayToggle={handleDayToggle}
				handleTimeChange={handleTimeChange}
			/>

			<DeletionConfirmation
				open={deleteOpen}
				title={`Delete ${employeeData?.full_name || "Employee"}`}
				description={
					<>
						Removing{" "}
						<span className='font-semibold'>
							{employeeData?.full_name || "this employee"}
						</span>{" "}
						will remove all of its history from the system that will impact the
						finances.
					</>
				}
				confirmText={`Delete ${employeeData?.full_name || "Employee"}`}
				confirmLoadingText='Deleting...'
				handleDelete={handleDeleteEmployee}
				handleCancel={() => setDeleteOpen(false)}
				isDeleting={isDeleting}
			/>
		</Layout>
	);
};

export default UpdateEmployee;
