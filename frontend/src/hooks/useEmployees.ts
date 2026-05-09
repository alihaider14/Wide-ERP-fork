import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "./useDebounce";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TEmployee, TEmployeeStatus, TSalaryData } from "@/types/Employee";
import { EmployeeService } from "@/services";
import toast from "react-hot-toast";
import { TError } from "@/types/TError";
import { handleApiError } from "@/helper/error-function";

const useEmployees = () => {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const [pageSize, setPageSize] = useState(10);
	const [search, setSearch] = useState("");
	const [pageNo, setPageNo] = useState(1);
	const [updatingEmployeeId, setUpdatingEmployeeId] = useState("");
	const [prompt, setPrompt] = useState<{ open: boolean; data?: TEmployee & { _id: string } }>({
		open: false,
	});

	const [fingerPrintModal, setFingerPrintModal] = useState<{
		open:boolean, employeeName:string | null, firstEmployee:boolean
	}>({open:false, employeeName:null, firstEmployee:false});

	const debounceSearch = useDebounce(search);

	const { data, isLoading } = useQuery({
		queryKey: ["employees", pageNo, pageSize, debounceSearch],
		queryFn: () => EmployeeService.getEmployees(pageNo, pageSize, debounceSearch),
	});

	const handleChangePageSize = (size: number) => {
		setPageSize(size);
		setPageNo(1);
	};

	const handleNextPage = () => {
		if (!data || pageNo >= data?.total_pages) return;
		setPageNo(pageNo + 1);
	};

	const handlePrevPage = () => {
		if (pageNo <= 1) return;
		setPageNo(pageNo - 1);
	};

	const handleLastPage = () => {
		if (!data || pageNo === data?.total_pages) return;
		setPageNo(data?.total_pages);
	};

	const handleFirstPage = () => {
		if (pageNo === 1) return;
		setPageNo(1);
	};

	const handleSumbitPrompt = () => {
		setPrompt({ open: false });
	};

	const handleCancelPrompt = () => setPrompt({ open: false });

	const [salaryModal, setSalaryModal] = useState<{
		open: boolean;
		employee: (TEmployee & { _id: string }) | null;
	}>({ open: false, employee: null });

	const handleOpenSalaryModal = (employee: TEmployee & { _id: string }) => {
		setSalaryModal({ open: true, employee });
	};

	const handleSalaryModalChange = (open: boolean) => {
		setSalaryModal({ open, employee: open ? salaryModal.employee : null });
	};

	const handleOpenFingerPrintModal = (employeeName:string | null) => {
		setFingerPrintModal({
			open:true, 
			employeeName, 
			firstEmployee: data?.employees[0].full_name == employeeName ? true : false
		});
	}

	const handleCloseFingerPrintModal = () => {
		setFingerPrintModal((prev) => ({
			...prev,
			open:false
		}));
	}

	const createEmployeeSalaryMutation = useMutation({
		mutationFn: EmployeeService.createEmployeeSalary,
		onSuccess: () => {
			toast.success("Employee salary paid successfully.");
			setSalaryModal({ open: false, employee: null });
			queryClient.invalidateQueries({ queryKey: ["employees"] });
		},
		onError: (error: TError) => {
			handleApiError(error, "Failed to pay salary. Please try again.");
		},
	});

	const handlePaySalary = (data: TSalaryData) => {
		if (!salaryModal.employee?._id) {
			return;
		}

		createEmployeeSalaryMutation.mutate({
			employee_id: salaryModal.employee._id,
			...data,
		});
	};

	const updateEmployeeStatusMutation = useMutation({
		mutationFn: EmployeeService.updateEmployeeStatus,
		onSuccess: () => {
			toast.success("Employee status updated successfully.");
			setUpdatingEmployeeId("");
			queryClient.invalidateQueries({ queryKey: ["employees"] });
		},
		onError: (error: TError) => {
			setUpdatingEmployeeId("");
			handleApiError(error, "Failed to update employee. Please try again.");
		},
	});

	const handleEmployeeStatusChange = (
		employeeId: string,
		status: TEmployeeStatus,
	) => {
		setUpdatingEmployeeId(employeeId);
		updateEmployeeStatusMutation.mutate({
			_id: employeeId,
			status,
		});
	};

	const handleUpdateFingerPrint = () => {
		setFingerPrintModal({
			open:true, 
			employeeName: fingerPrintModal.employeeName, 
			firstEmployee: false
		});
	};


	const isTableLoader = isLoading;
	const isCustomerLoader = false;

	return {
		search,
		isCustomerLoader,
		isTableLoader,
		employeesData: data?.employees,
		pageNo,
		pageSize,
		navigate,
		setSearch,
		handleNextPage,
		handlePrevPage,
		handleLastPage,
		handleChangePageSize,
		handleFirstPage,
		prompt,
		setPrompt,
		handleSumbitPrompt,
		handleCancelPrompt,
		data,
		salaryModal,
		handleOpenSalaryModal,
		handleSalaryModalChange,
		handlePaySalary,
		isSalarySubmitting: createEmployeeSalaryMutation.isPending,
		handleEmployeeStatusChange,
		updatingEmployeeId,
		handleOpenFingerPrintModal,
		handleCloseFingerPrintModal,
		fingerPrintModal,
		handleUpdateFingerPrint
	};
};

export default useEmployees;
