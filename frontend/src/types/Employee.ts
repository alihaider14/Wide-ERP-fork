import type { ReactNode } from "react";

export type TEmployeeStatus = "Onboard" | "Active" | "On hold" | "Terminated";

export type TEmployee = {
  _id?: string;
  full_name: string;
  designation: string;
  base_salary: number;
  phone: string;
  cnic: string;
  address: string;
  joined_at: string;
  status: TEmployeeStatus;
  working_hours?: TWorkingHourEntry[];
  attendance?: string;
  last_paid?: string;
  last_payment_amount?: number;
  experience?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type TDateRange = {
  from: Date | undefined;
  to: Date | undefined;
};

export type TEmployeeDetail = TEmployee & {
  _id: string;
};

export type TEmployeeByIdResponse = {
  employee?: TEmployeeDetail;
};

export type TSalaryData = {
  base_salary: number;
  commission: number;
  other: number;
  payment_month: string;
  paid_at: string;
  note: string;
};

export type TCreateEmployeeSalaryData = TSalaryData & {
  employee_id: string;
};

export type TUpdateEmployeeSalaryData = TSalaryData & {
  _id: string;
};

export type TEmployeeSalaryRecord = {
  _id: string;
  employee_id: string;
  base_salary: number;
  commission: number;
  other: number;
  payment_month: string;
  paid_at: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
};

export type TEmployeeSalaryHistory = {
  _id: string;
  month: string;
  note?: string;
  on_time: string;
  late: string;
  absence: string;
  leave: string;
  base_salary: number;
  commission: number;
  other: number;
  paid_at: string;
  created_at: string;
};

export type TEmployeeSalaryHistoryResponse = {
  salaries: TEmployeeSalaryRecord[];
  total_pages: number;
  total_rows: number;
  from: number;
  to: number;
};

export type TEmployeeDetailTableHead = {
  title: ReactNode;
  className?: string;
  sortable?: boolean;
  sortKey?: string;
};

export type TEmployeeSummaryCardProps = {
  employeeName: string;
  statusLabel?: string;
  designationLabel: string;
  phoneLabel: string;
  baseSalaryLabel: string;
  experienceLabel: string;
  attendanceLabel: string;
};

export type TWorkingHoursCardProps = {
  workingHours: TWorkingHourEntry[];
};

export type TEmployeeDetailTableProps = {
  head: TEmployeeDetailTableHead[];
  children: ReactNode;
  dateRange: TDateRange;
  onDateRangeChange: (dateRange: TDateRange) => void;
  onClickPaySalary: () => void;
  disablePaySalary?: boolean;
  pageSize: number;
  handleChangePageSize: (pageSize: number) => void;
  remaining: string;
  handleFirstPage: () => void;
  handlePrevPage: () => void;
  handleNextPage: () => void;
  handleLastPage: () => void;
  disabledPagination: {
    first: boolean;
    prev: boolean;
    next: boolean;
    last: boolean;
  };
};

export type TDayName = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";

export type TWorkingHourEntry = {
  day: TDayName;
  is_working_day: boolean;
  start_time: string | null;
  end_time: string | null;
};

export type TEmployeeStatusSelectProps = {
	status: TEmployeeStatus;
	onChange: (status: TEmployeeStatus) => void;
};

