import { handleApiError } from "@/helper/error-function";
import { DEFAULT_WORKING_HOURS, EMPLOYEE_STATUSES } from "@/constant/Employee";
import { ERROR_MESSAGES } from "@/constant/errorMessage";
import { TAutocomplete } from "@/components/custom/CustomAutocomplete";
import { EmployeeService } from "@/services";
import { TEmployee, TEmployeeStatus, TWorkingHourEntry } from "@/types/Employee";
import { TError } from "@/types/TError";
import { employeeSchema } from "@/validations/employee.schema";
import { formatCNIC } from "@/helper/cnic";
import { validateWorkingHours } from "@/validations/employee.schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const useAddEmployee = () => {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const [loading, setLoading] = useState(false);
	const [employeeData, setEmployeeData] = useState<Partial<TEmployee>>({
		joined_at: new Date().toISOString(),
	});
	const [workingHours, setWorkingHours] = useState<TWorkingHourEntry[]>(
		DEFAULT_WORKING_HOURS.map((entry) => ({ ...entry })),
	);
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [statusInputValue, setStatusInputValue] = useState("");

	const handleDayToggle = (index: number, checked: boolean) => {
		setWorkingHours((prev) =>
			prev.map((entry, i) => (i === index ? { ...entry, is_working_day: checked } : entry)),
		);
	};

	const handleTimeChange = (index: number, field: "start_time" | "end_time", value: string) => {
		setWorkingHours((prev) =>
			prev.map((entry, i) => (i === index ? { ...entry, [field]: value || null } : entry)),
		);
	};
	const employeeStatusOptions: TAutocomplete[] = EMPLOYEE_STATUSES.map(
		(status) => ({
			id: status,
			name: status,
		}),
	);

	const handleChange =
		(setter: React.Dispatch<React.SetStateAction<Partial<TEmployee>>>) =>
		(event: React.ChangeEvent<HTMLInputElement>) => {
			const { name, value } = event.target;
			const formattedValue = name === "cnic" ? formatCNIC(value) : value;
			setter((prev) => ({
				...prev,
				[name]: formattedValue,
			}));
		};

	const addEmployeeMutation = useMutation({
		mutationFn: EmployeeService.addEmployee,
		onSuccess: handleAddEmployeeSuccess,
		onError: handleAddEmployeeError,
	});

	const handleAddEmployee = (data: Partial<TEmployee>) => {
		setLoading(true);
		addEmployeeMutation.mutate(data);
	};

	function handleAddEmployeeSuccess() {
		toast.success("Employee added successfully.");
		setLoading(false);
		setEmployeeData({
			joined_at: new Date().toISOString(),
		});
		setWorkingHours(DEFAULT_WORKING_HOURS.map((entry) => ({ ...entry })));
		setStatusInputValue("");
		queryClient.invalidateQueries({ queryKey: ["employees"] });
		navigate("/employees");
	}

	function handleAddEmployeeError(error: TError) {
		setLoading(false);
		handleApiError(error, "Failed to add employee. Please try again.");
	}

	const handleCancel = () => {
		navigate("/employees");
	};

	const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const result = employeeSchema.safeParse(employeeData);

		if (result.success) {
			const whError = validateWorkingHours(workingHours);
			if (whError) {
				toast.error(whError);
				return;
			}
			setErrors({});
			handleAddEmployee({
				...employeeData,
				working_hours: workingHours,
			});
			return;
		}

		const fieldErrors: Record<string, string> = {};
		result.error.errors.forEach((error) => {
			if (error.path.length > 0) {
				fieldErrors[String(error.path[0])] = error.message;
			}
		});

		if (fieldErrors.status && statusInputValue.trim() && !employeeData.status) {
			fieldErrors.status = ERROR_MESSAGES.statusInvalid;
		}

		setErrors(fieldErrors);
	};

	const handleStatusInputChange: React.ChangeEventHandler<HTMLInputElement> = (
		event,
	) => {
		setStatusInputValue(event.target.value);
		setEmployeeData((prev) => ({
			...prev,
			status: undefined,
		}));
	};

	const handleStatusSelect = (item: TAutocomplete) => {
		setStatusInputValue(item.name);
		setEmployeeData((prev) => ({
			...prev,
			status: item.id as TEmployeeStatus,
		}));
		setErrors((prev) => {
			if (!prev.status) {
				return prev;
			}

			const { status, ...rest } = prev;
			return rest;
		});
	};

	const isLoading = addEmployeeMutation.isPending || loading;

	return {
		isLoading,
		employeeData,
		setEmployeeData,
		handleChange,
		handleAddEmployee,
		handleCancel,
		errors,
		employeeStatusOptions,
		handleFormSubmit,
		handleStatusInputChange,
		handleStatusSelect,
		workingHours,
		handleDayToggle,
		handleTimeChange,
	};
};

export default useAddEmployee;
