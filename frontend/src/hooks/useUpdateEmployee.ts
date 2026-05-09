import {
	TEmployee,
	TEmployeeByIdResponse,
	TEmployeeStatus,
	TWorkingHourEntry,
} from "@/types/Employee";
import { TError } from "@/types/TError";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { EmployeeService } from "@/services";
import { handleApiError } from "@/helper/error-function";
import { DEFAULT_WORKING_HOURS, EMPLOYEE_STATUSES } from "@/constant/Employee";
import { ERROR_MESSAGES } from "@/constant/errorMessage";
import { TAutocomplete } from "@/components/custom/CustomAutocomplete";
import { employeeSchema } from "@/validations/employee.schema";
import { formatCNIC } from "@/helper/cnic";
import { validateWorkingHours } from "@/validations/employee.schema";

const useUpdateEmployee = () => {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { id } = useParams();
	const [loading, setLoading] = useState(false);
	const [employeeData, setEmployeeData] = useState<Partial<TEmployee>>({});
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

	const { data, isLoading: isEmployeeByIdLoading } = useQuery<TEmployeeByIdResponse>({
		queryKey: [`employeeById/${id}`, id],
		queryFn: () => EmployeeService.getEmployeeById(id!),
		enabled: !!id,
	});

	useEffect(() => {
		if (data?.employee) {
			setEmployeeData(data.employee);
			setStatusInputValue(data.employee.status || "");
			if (data.employee.working_hours?.length) {
				setWorkingHours(data.employee.working_hours);
			}
		}
	}, [data]);

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

	const updateEmployeeMutation = useMutation({
		mutationFn: EmployeeService.updateEmployee,
		onSuccess: handleUpdateEmployeeSuccess,
		onError: handleUpdateEmployeeError,
	});

	const deleteEmployeeMutation = useMutation({
		mutationFn: EmployeeService.deleteEmployee,
		onSuccess: handleDeleteEmployeeSuccess,
		onError: handleDeleteEmployeeError,
	});

	const handleUpdateEmployee = () => {
		if (!id) {
			return;
		}

		setLoading(true);
		updateEmployeeMutation.mutate({
			...employeeData,
			_id: id,
			working_hours: workingHours,
		});
	};

	function handleUpdateEmployeeSuccess() {
		toast.success("Employee updated successfully.");
		setLoading(false);

		queryClient.invalidateQueries({ queryKey: ["employees"] });
		navigate("/employees");
	}

	function handleUpdateEmployeeError(error: TError) {
		setLoading(false);
		handleApiError(error, "Failed to update employee. Please try again.");
	}

	const [deleteOpen, setDeleteOpen] = useState(false);

	const handleOpenDelete = useCallback(() => setDeleteOpen(true), []);

	const handleDeleteEmployee = () => {
		if (!id) {
			return;
		}

		deleteEmployeeMutation.mutate(id);
	};

	function handleDeleteEmployeeSuccess() {
		toast.success("Employee deleted successfully.");
		setDeleteOpen(false);
		queryClient.invalidateQueries({ queryKey: ["employees"] });
		navigate("/employees");
	}

	function handleDeleteEmployeeError(error: TError) {
		handleApiError(error, "Failed to delete employee. Please try again.");
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
			handleUpdateEmployee();
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

	const isLoading =
		updateEmployeeMutation.isPending ||
		loading ||
		isEmployeeByIdLoading;

	return {
		isLoading,
		isDeleting: deleteEmployeeMutation.isPending,
		employeeData,
		setEmployeeData,
		handleChange,
		handleUpdateEmployee,
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
	};
};

export default useUpdateEmployee;
