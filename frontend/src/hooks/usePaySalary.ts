import { SHORT_MONTH_NAMES } from "@/constant/Date";
import {
	checkFutureDate,
	checkFutureMonth,
} from "@/helper/date-format";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { TEmployee, TSalaryData } from "@/types/Employee";
import { format } from "date-fns";
import { paySalarySchema } from "@/validations/employee.schema";

const usePaySalary = (
	open: boolean,
	employee: (TEmployee & { _id: string }) | null,
	onSubmit: (data: TSalaryData) => void,
	initialData?: TSalaryData | null,
) => {
	const today = new Date();
	const currentYear = today.getFullYear();
	const currentMonthLabel = `${SHORT_MONTH_NAMES[today.getMonth()]}, ${currentYear}`;
	const currentPaidAt = format(today, "yyyy-MM-dd");
	const createInitialSalaryData = (
		currentEmployee: (TEmployee & { _id: string }) | null,
	): TSalaryData => ({
		base_salary: currentEmployee?.base_salary ?? 0,
		commission: 0,
		other: 0,
		payment_month: currentMonthLabel,
		paid_at: currentPaidAt,
		note: "",
	});
	const [salaryData, setSalaryData] = useState<TSalaryData>(
		createInitialSalaryData(employee),
	);
	const [monthPickerOpen, setMonthPickerOpen] = useState(false);
	const [paidAtOpen, setPaidAtOpen] = useState(false);
	const [selectedYear, setSelectedYear] = useState(currentYear);

	useEffect(() => {
		if (!open || !employee) {
			return;
		}

		if (initialData) {
			setSalaryData(initialData);
		} else {
			setSalaryData(createInitialSalaryData(employee));
		}
		setSelectedYear(currentYear);
	}, [open, employee, currentYear]);

	const isFutureMonth = (monthIndex: number, year: number) =>
		checkFutureMonth(monthIndex, year, today);

	const isFutureDate = (date: Date) => checkFutureDate(date, today);

	const handleNumberChange = (field: keyof TSalaryData) => (e: React.ChangeEvent<HTMLInputElement>) => {
		const val = e.target.value.replace(/[^\d]/g, "");
		setSalaryData((prev) => ({
			...prev,
			[field]: val === "" ? 0 : Number(val),
		}));
	};

	const handleMonthSelect = (monthIndex: number) => {
		setSalaryData((prev) => ({
			...prev,
			payment_month: `${SHORT_MONTH_NAMES[monthIndex]}, ${selectedYear}`,
		}));
		setMonthPickerOpen(false);
	};

	const handlePaidAtSelect = (date: Date) => {
		setSalaryData((prev) => ({
			...prev,
			paid_at: format(date, "yyyy-MM-dd"),
		}));
		setPaidAtOpen(false);
	};

	const handleNoteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSalaryData((prev) => ({ ...prev, note: e.target.value }));
	};

	const handleSubmit = () => {
		const parseResult = paySalarySchema.safeParse(salaryData);

		if (!parseResult.success) {
			toast.error(parseResult.error.errors[0]?.message || "Validation error");
			return;
		}

		onSubmit(parseResult.data);
	};

	return {
		salaryData,
		monthPickerOpen,
		setMonthPickerOpen,
		paidAtOpen,
		setPaidAtOpen,
		selectedYear,
		setSelectedYear,
		currentYear,
		isFutureMonth,
		isFutureDate,
		handleNumberChange,
		handleMonthSelect,
		handlePaidAtSelect,
		handleNoteChange,
		handleSubmit,
		MONTHS: SHORT_MONTH_NAMES,
	};
};

export default usePaySalary;
