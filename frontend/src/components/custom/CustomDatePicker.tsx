"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { COLOR } from "@/constant/Colors";
import { format } from "date-fns";
import { isoToDDMMYYYY } from "@/helper/date-format";

type TProps = {
	onDateChange?: (date: Date) => void;
	date?: Date;
	className?: string;
	name: string;
	label: string;
	required?: boolean;
	placeholder?: string;
	displayFormat?: string;
	timeLabel?: string;
	timeValue?: string;
	onTimeChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
	disabledDates?: React.ComponentProps<typeof Calendar>["disabled"];
	toMonth?: Date;
};

const CustomDatePicker = ({
	onDateChange,
	date,
	name,
	label,
	required,
	className,
	placeholder = "DD-MM-YYYY",
	displayFormat,
	timeLabel = "Time",
	timeValue,
	onTimeChange,
	disabledDates,
	toMonth,
}: TProps) => {
	const [open, setOpen] = React.useState(false);
	const showTimeSelector = !!timeValue && !!onTimeChange;
	const displayValue = date
		? displayFormat
			? format(new Date(date), displayFormat)
			: isoToDDMMYYYY(new Date(date).toISOString())
		: placeholder;

	return (
		<div className='flex flex-col gap-1'>
			{label && (
				<Label htmlFor={name}>
					{label} {required && <span style={{ color: COLOR.red }}>*</span>}
				</Label>
			)}
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						variant='outline'
						id={name}
						className={cn(
							"w-[200px] justify-between border border-borderColor rounded-[3px] bg-white px-5 py-[6px] text-left font-poppins text-[14px] font-normal leading-[100%] tracking-[0] shadow-none hover:bg-white hover:text-foreground",
							`${date ? "" : "text-gray-500"}`,
							className,
						)}
					>
						{displayValue}
					</Button>
				</PopoverTrigger>
				<PopoverContent className='w-auto overflow-hidden p-0' align='start'>
					<Calendar
						mode='single'
						selected={date}
						defaultMonth={date}
						captionLayout='dropdown'
						disabled={disabledDates}
						toMonth={toMonth}
						onSelect={(date) => {
							if (!date) return;
							onDateChange?.(date);
							if (!showTimeSelector) {
								setOpen(false);
							}
						}}
						id={name}
					/>
					{showTimeSelector ? (
						<div className='border-t border-border p-3'>
							<Input
								label={timeLabel}
								type='time'
								value={timeValue}
								onChange={onTimeChange}
								className='pl-4'
							/>
						</div>
					) : null}
				</PopoverContent>
			</Popover>
		</div>
	);
};
export default CustomDatePicker;
