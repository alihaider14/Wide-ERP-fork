import { Input } from "../ui/input";
import { Label } from "../ui/label";
import CustomDatePicker from "./CustomDatePicker";
import CustomAutocomplete, { TAutocomplete } from "./CustomAutocomplete";
import WorkingHoursSection from "./WorkingHoursSection";
import { TEmployee, TWorkingHourEntry } from "@/types/Employee";
import { PAYMENT_DATE_FORMAT } from "@/constant/Date";
import React from "react";
import FormActionButtons from "./FormActionButtons";
import { formatCNIC } from "@/helper/cnic";

interface EmployeeFormProps {
	employeeData: Partial<TEmployee>;
	setEmployeeData: React.Dispatch<React.SetStateAction<Partial<TEmployee>>>;
	errors: Record<string, string>;
	employeeStatusOptions: TAutocomplete[];
	handleChange: (
		setter: React.Dispatch<React.SetStateAction<Partial<TEmployee>>>,
	) => (event: React.ChangeEvent<HTMLInputElement>) => void;
	handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
	handleStatusInputChange: React.ChangeEventHandler<HTMLInputElement>;
	handleStatusSelect: (item: TAutocomplete) => void;
	handleCancel?: () => void;
	handleDelete?: () => void;
	isUpdate?: boolean;
	workingHours: TWorkingHourEntry[];
	handleDayToggle: (index: number, checked: boolean) => void;
	handleTimeChange: (
		index: number,
		field: "start_time" | "end_time",
		value: string,
	) => void;
}

function EmployeeForm({
	employeeData,
	setEmployeeData,
	errors,
	employeeStatusOptions,
	handleChange,
	handleStatusInputChange,
	handleStatusSelect,
	handleCancel,
	handleSubmit,
	handleDelete,
	isUpdate = false,
	workingHours,
	handleDayToggle,
	handleTimeChange,
}: EmployeeFormProps) {

	return (
		<form onSubmit={handleSubmit}>
			<div className='max-w-[1190px] w-auto flex flex-col gap-[30px] mt-5 bg-white p-10 rounded-[5px] border border-border'>
				<div className='flex gap-[30px]'>
					<div className='w-[540px] h-[58px]'>
						<Input
							label='Full Name'
							required
							placeholder='John Doe'
							name='full_name'
							value={employeeData?.full_name || ""}
							onChange={handleChange(setEmployeeData)}
							className='pl-4'
						/>
						{errors.full_name && (
							<span className='text-destructive text-xs'>{errors.full_name}</span>
						)}
					</div>
					<div className='w-[540px] h-[58px]'>
						<Input
							label='Designation'
							required
							placeholder='Manager'
							name='designation'
							value={employeeData?.designation || ""}
							onChange={handleChange(setEmployeeData)}
							className='pl-4'
						/>
						{errors.designation && (
							<span className='text-destructive text-xs'>
								{errors.designation}
							</span>
						)}
					</div>
				</div>

				<div className='flex gap-[30px]'>
					<div className='w-[540px] h-[58px]'>
						<Input
							label='Base Salary'
							required
							placeholder='25,000'
							name='base_salary'
							type='text'
							value={employeeData?.base_salary ?? ""}
							onChange={(e) => {
								const val = e.target.value.replace(/[^\d]/g, "");
								setEmployeeData((prev) => ({
									...prev,
									base_salary: val === "" ? undefined : Number(val),
								}));
							}}
							className='pl-4'
						/>
						{errors.base_salary && (
							<span className='text-destructive text-xs'>
								{errors.base_salary}
							</span>
						)}
					</div>
					<div className='w-[540px] h-[58px]'>
						<Input
							label='Phone'
							required
							placeholder='+923211234567'
							name='phone'
							value={employeeData?.phone || ""}
							onChange={(e) => {
								const val = e.target.value.replace(/[^\d+]/g, "");
								setEmployeeData((prev) => ({ ...prev, phone: val }));
							}}
							className='pl-4'
						/>
						{errors.phone && (
							<span className='text-destructive text-xs'>{errors.phone}</span>
						)}
					</div>
				</div>

				<div className='flex gap-[30px]'>
					<div className='w-[540px] h-[58px]'>
						<Input
							label='CNIC'
							required
							placeholder='XXXXX-XXXXXXX-X'
							name='cnic'
							maxLength={15}
							value={employeeData?.cnic || ""}
							onChange={(e) => {
								const formatted = formatCNIC(e.target.value);
								setEmployeeData((prev) => ({ ...prev, cnic: formatted }));
							}}
							className='pl-4'
						/>
						{errors.cnic && (
							<span className='text-destructive text-xs'>{errors.cnic}</span>
						)}
					</div>
					<div className='w-[540px] h-[58px]'>
						<Input
							label='Address'
							required
							placeholder='H# 123, Sector 1, Karachi, Sindh, Pakistan'
							name='address'
							value={employeeData?.address || ""}
							onChange={handleChange(setEmployeeData)}
							className='pl-4'
						/>
						{errors.address && (
							<span className='text-destructive text-xs'>{errors.address}</span>
						)}
					</div>
				</div>

				<div className='flex gap-[30px]'>
					<div className='w-[540px] h-[58px]'>
						<CustomDatePicker
							name='joined_at'
							label='Joined At'
							required
							className='w-full'
							placeholder='Mon Feb 23, 2026'
							displayFormat={PAYMENT_DATE_FORMAT}
							date={
								employeeData?.joined_at
									? new Date(employeeData.joined_at)
									: undefined
							}
							onDateChange={(date) =>
								setEmployeeData((prev) => ({
									...prev,
									joined_at: date.toISOString(),
								}))
							}
						/>
						{errors.joined_at && (
							<span className='text-destructive text-xs'>{errors.joined_at}</span>
						)}
					</div>
					<div className='w-[540px] h-[58px] flex flex-col gap-1'>
						<Label>
							Employment Status <span className='text-destructive'>*</span>
						</Label>
						<CustomAutocomplete
							className='w-full'
							data={employeeStatusOptions}
							placeholder='Select Status'
							name='status'
							value={employeeData?.status || ""}
							onChange={handleStatusInputChange}
							handleSelect={handleStatusSelect}
						/>
						{errors.status && (
							<span className='text-destructive text-xs'>{errors.status}</span>
						)}
					</div>
				</div>

				<WorkingHoursSection
					workingHours={workingHours}
					handleDayToggle={handleDayToggle}
					handleTimeChange={handleTimeChange}
				/>

				<div className='sm:col-span-2 flex items-center gap-[30px] max-w-[1110px] w-auto h-9'>
					{isUpdate && handleDelete && (
						<button
							className='text-sm font-medium cursor-pointer text-destructive'
							type='button'
							onClick={handleDelete}
						>
							Delete
						</button>
					)}
					<FormActionButtons onCancel={handleCancel} submitType="submit" className="ml-auto" />
				</div>
			</div>
		</form>
	);
}

export default EmployeeForm;
