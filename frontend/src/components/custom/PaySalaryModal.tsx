import * as DialogPrimitive from "@radix-ui/react-dialog";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { TEmployee, TSalaryData } from "@/types/Employee";
import { COLOR } from "@/constant/Colors";
import { format } from "date-fns";
import usePaySalary from "@/hooks/usePaySalary";
import { toStableLocalDate } from "@/helper/payment-date";

interface PaySalaryModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	employee: (TEmployee & { _id: string }) | null;
	onSubmit: (data: TSalaryData) => void;
	isSubmitting?: boolean;
	initialData?: TSalaryData | null;
}

const PaySalaryModal = ({
	open,
	onOpenChange,
	employee,
	onSubmit,
	isSubmitting = false,
	initialData = null,
}: PaySalaryModalProps) => {
	const {
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
		MONTHS,
	} = usePaySalary(open, employee, onSubmit, initialData);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className='sm:max-w-[400px] max-h-[80vh] overflow-y-auto rounded-[5px] p-5 gap-5' isCrossIcon={false}>
				<DialogHeader className='relative flex items-center justify-center h-6'>
					<DialogTitle className='text-center text-sm leading-6 font-normal'>
						You're paying to <span className='font-semibold'>{employee?.full_name}</span>
					</DialogTitle>
					<DialogPrimitive.Close className='absolute right-0 cursor-pointer opacity-70 hover:opacity-100'>
						<X className='size-5' color={COLOR.grey} />
					</DialogPrimitive.Close>
				</DialogHeader>

				<div className='w-full xl:max-w-[350px] flex flex-col gap-5'>
					<Input
						label='Base Salary'
						required
						value={salaryData.base_salary}
						onChange={handleNumberChange("base_salary")}
						className='pl-4'
					/>

					<Input
						label='Commission'
						value={salaryData.commission}
						onChange={handleNumberChange("commission")}
						className='pl-4'
					/>

					<Input
						label='Other'
						value={salaryData.other}
						onChange={handleNumberChange("other")}
						className='pl-4'
					/>

					<div className='flex flex-col gap-1'>
						<Label>
							Payment Month <span style={{ color: COLOR.red }}>*</span>
						</Label>
						<Popover open={monthPickerOpen} onOpenChange={setMonthPickerOpen}>
							<PopoverTrigger asChild>
								<Button
									variant='outline'
									className={cn(
										"w-full justify-start border border-borderColor rounded-[3px] px-4 bg-white h-9 font-poppins text-[14px] font-normal leading-[100%] tracking-[0]",
										!salaryData.payment_month && "text-gray-500",
									)}
								>
									{salaryData.payment_month || "Select Month"}
								</Button>
							</PopoverTrigger>
							<PopoverContent className='w-auto p-4' align='start'>
								<div className='flex items-center justify-between mb-3'>
									<button
										type='button'
										className='text-sm font-medium cursor-pointer'
										onClick={() => setSelectedYear((y) => y - 1)}
									>
										←
									</button>
									<span className='text-sm font-medium'>{selectedYear}</span>
									<button
										type='button'
										className='text-sm font-medium cursor-pointer disabled:cursor-not-allowed disabled:opacity-50'
										disabled={selectedYear >= currentYear}
										onClick={() => setSelectedYear((y) => y + 1)}
									>
										→
									</button>
								</div>
								<div className='grid grid-cols-3 gap-2'>
									{MONTHS.map((month, index) => (
										<Button
											key={month}
											variant='ghost'
											size='sm'
											className='text-sm'
											disabled={isFutureMonth(index, selectedYear)}
											onClick={() => handleMonthSelect(index)}
										>
											{month}
										</Button>
									))}
								</div>
							</PopoverContent>
						</Popover>
					</div>

					<div className='flex flex-col gap-1'>
						<Label>
							Paid At <span style={{ color: COLOR.red }}>*</span>
						</Label>
						<Popover open={paidAtOpen} onOpenChange={setPaidAtOpen}>
							<PopoverTrigger asChild>
								<Button
									variant='outline'
									className={cn(
										"w-full justify-start border border-borderColor rounded-[3px] px-4 bg-white h-9 font-poppins text-[14px] font-normal leading-[100%] tracking-[0]",
										!salaryData.paid_at && "text-gray-500",
									)}
								>
									{salaryData.paid_at
										? format(toStableLocalDate(salaryData.paid_at), "MMM d, yyyy")
										: "Select Date"}
								</Button>
							</PopoverTrigger>
							<PopoverContent className='w-auto overflow-hidden p-0' align='start'>
								<Calendar
									mode='single'
									selected={
										salaryData.paid_at
											? toStableLocalDate(salaryData.paid_at)
											: undefined
									}
									captionLayout='dropdown'
									disabled={isFutureDate}
									toMonth={new Date()}
									onSelect={(date) => {
										if (date) handlePaidAtSelect(date);
									}}
								/>
							</PopoverContent>
						</Popover>
					</div>

					<Input
						label='Note'
						placeholder='Something to remember...'
						value={salaryData.note}
						onChange={handleNoteChange}
						className='pl-4'
					/>

					<Button
						className='w-full'
						onClick={handleSubmit}
						disabled={isSubmitting}
					>
						{isSubmitting ? "Submitting..." : "Submit"}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default PaySalaryModal;
