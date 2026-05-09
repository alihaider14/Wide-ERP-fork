import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { formatShortMonthDayYear } from "@/helper/date-format";
import { numberFormateToLocalString } from "@/helper/number-formator";
import { EmployeeService } from "@/services";
import { format } from "date-fns";
import {
	TDateRange,
	TEmployeeByIdResponse,
	TEmployeeSalaryHistory,
	TEmployeeSalaryHistoryResponse,
	TEmployeeSalaryRecord,
	TSalaryData,
} from "@/types/Employee";
import toast from "react-hot-toast";
import { TError } from "@/types/TError";
import { handleApiError } from "@/helper/error-function";

const useViewEmployee = () => {
	const { id } = useParams();
	const queryClient = useQueryClient();
	const [dateRange, setDateRange] = useState<TDateRange>(() => {
		const today = new Date();
		return {
			from: new Date(today.getFullYear(), today.getMonth(), 1),
			to: today,
		};
	});
	const [pageNo, setPageNo] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	const [salaryModalOpen, setSalaryModalOpen] = useState(false);
	const [editingSalary, setEditingSalary] = useState<TEmployeeSalaryRecord | null>(null);
	const fromDate = dateRange.from ? format(dateRange.from, "yyyy-MM-dd") : "";
	const toDate = dateRange.to ? format(dateRange.to, "yyyy-MM-dd") : "";

	const {
		data: employeeData,
		isLoading: isEmployeeLoading,
	} = useQuery<TEmployeeByIdResponse>({
		queryKey: ["employeeById", id],
		queryFn: () => EmployeeService.getEmployeeById(id!),
		enabled: !!id,
	});

	const {
		data: salaryHistoryData,
		isLoading: isSalaryHistoryLoading,
	} = useQuery<TEmployeeSalaryHistoryResponse>({
		queryKey: [
			"employeeSalaryHistory",
			id,
			pageNo,
			pageSize,
			fromDate,
			toDate,
		],
		queryFn: () =>
			EmployeeService.getEmployeeSalaryHistory(
				id!,
				pageNo,
				pageSize,
				fromDate,
				toDate,
			),
		enabled: !!id,
	});

	const refetchEmployeeData = async () => {
		await queryClient.invalidateQueries({
			queryKey: ["employeeSalaryHistory", id],
		});
		await queryClient.invalidateQueries({ queryKey: ["employeeById", id] });
		await queryClient.invalidateQueries({ queryKey: ["employees"] });
	};

	const employee = employeeData?.employee ?? null;
	const joinedAtLabel = formatShortMonthDayYear(employee?.joined_at);
	const experienceLabel =
		employee?.experience && joinedAtLabel !== "-"
			? `${joinedAtLabel} — Present (${employee.experience})`
			: employee?.experience || joinedAtLabel;
	const baseSalaryLabel = employee
		? `Rs. ${numberFormateToLocalString(employee.base_salary ?? 0)}`
		: "-";

	const handleDateRangeChange = (nextDateRange: TDateRange) => {
		setDateRange(nextDateRange);
		setPageNo(1);
	};

	const handleChangePageSize = (size: number) => {
		setPageSize(size);
		setPageNo(1);
	};

	const totalRows = salaryHistoryData?.total_rows || 0;
	const totalPages = Math.max(1, Math.ceil(totalRows / pageSize));
	const paginatedSalaryHistory: TEmployeeSalaryHistory[] =
		salaryHistoryData?.salaries.map((salary) => ({
			_id: salary._id,
			month: salary.payment_month,
			note: salary.note,
			on_time: "-",
			late: "-",
			absence: "-",
			leave: "-",
			base_salary: salary.base_salary,
			commission: salary.commission,
			other: salary.other,
			paid_at: salary.paid_at,
			created_at: salary.createdAt,
		})) ?? [];
	const from = salaryHistoryData?.from || 0;
	const to = salaryHistoryData?.to || 0;

	const handleNextPage = () => {
		if (pageNo >= totalPages) {
			return;
		}

		setPageNo((prev) => prev + 1);
	};

	const handlePrevPage = () => {
		if (pageNo <= 1) {
			return;
		}

		setPageNo((prev) => prev - 1);
	};

	const handleFirstPage = () => {
		if (pageNo === 1) {
			return;
		}

		setPageNo(1);
	};

	const handleLastPage = () => {
		if (pageNo === totalPages) {
			return;
		}

		setPageNo(totalPages);
	};

	const handleOpenSalaryModal = () => {
		if (!employee) {
			return;
		}

		setEditingSalary(null);
		setSalaryModalOpen(true);
	};

	const handleEditSalary = (salaryRecord: TEmployeeSalaryRecord) => {
		setEditingSalary(salaryRecord);
		setSalaryModalOpen(true);
	};

	const handleSalaryModalChange = (open: boolean) => {
		setSalaryModalOpen(open);
		if (!open) {
			setEditingSalary(null);
		}
	};

	const createEmployeeSalaryMutation = useMutation({
		mutationFn: EmployeeService.createEmployeeSalary,
		onSuccess: async () => {
			setPageNo(1);
			toast.success("Employee salary paid successfully.");
			setSalaryModalOpen(false);
			await refetchEmployeeData();
		},
		onError: (error: TError) => {
			handleApiError(error, "Failed to pay salary. Please try again.");
		},
	});

	const updateEmployeeSalaryMutation = useMutation({
		mutationFn: EmployeeService.updateEmployeeSalary,
		onSuccess: async () => {
			setPageNo(1);
			toast.success("Salary record updated successfully.");
			setSalaryModalOpen(false);
			setEditingSalary(null);
			await refetchEmployeeData();
		},
		onError: (error: TError) => {
			handleApiError(error, "Failed to update salary. Please try again.");
		},
	});

	const handlePaySalary = (data: TSalaryData) => {
		if (!employee?._id) {
			return;
		}

		if (editingSalary) {
			updateEmployeeSalaryMutation.mutate({
				_id: editingSalary._id,
				...data,
			});
		} else {
			createEmployeeSalaryMutation.mutate({
				employee_id: employee._id,
				...data,
			});
		}
	};

	return {
		isLoading: isEmployeeLoading,
		isTableLoader: isSalaryHistoryLoading,
		employee,
		employeeName: employee?.full_name || "N/A",
		phoneLabel: employee?.phone || "-",
		designationLabel: employee?.designation || "-",
		statusLabel: employee?.status,
		baseSalaryLabel,
		experienceLabel,
		dateRange,
		handleDateRangeChange,
		pageNo,
		pageSize,
		handleChangePageSize,
		handleNextPage,
		handlePrevPage,
		handleFirstPage,
		handleLastPage,
		remainingLabel: `${from} - ${to} of ${totalRows}`,
		disabledPagination: {
			first: pageNo === 1,
			prev: pageNo === 1,
			next: pageNo === totalPages,
			last: pageNo === totalPages,
		},
		salaryModalOpen,
		handleOpenSalaryModal,
		handleEditSalary,
		handleSalaryModalChange,
		handlePaySalary,
		isSalarySubmitting: createEmployeeSalaryMutation.isPending || updateEmployeeSalaryMutation.isPending,
		salaryHistory: paginatedSalaryHistory,
		salaryRecords: salaryHistoryData?.salaries ?? [],
		editingSalary,
	};
};

export default useViewEmployee;
