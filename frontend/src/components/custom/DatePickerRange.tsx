import { format } from "date-fns";
import { CalendarDays, MoveRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger
} from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "../ui/select";
import { COLOR } from "@/constant/Colors";
import { useState } from "react";
import { getLastMonth } from "@/helper/time-formator";
import { setStartOfDay, setEndOfDay } from "@/helper/date-format";
import { TDateRange } from "@/types/Date";

type DateRangePickerProps = {
	onDateRangeChange?: (dateRange: TDateRange) => void;
	initialValue?: TDateRange;
	className?: string;
};

export type DateRange = TDateRange;

type PresetOption = {
	label: string;
	getValue: () => TDateRange;
};

const presetOptions: PresetOption[] = [
	{
		label: "Today",
		getValue: () => {
			const today = new Date();
			return { from: setStartOfDay(today), to: setEndOfDay(today) };
		}
	},
	{
		label: "Yesterday",
		getValue: () => {
			const yesterday = new Date();
			yesterday.setDate(yesterday.getDate() - 1);
			return { from: setStartOfDay(yesterday), to: setEndOfDay(yesterday) };
		}
	},
	{
		label: "Last 7 days",
		getValue: () => {
			const today = new Date();
			const last7Days = new Date();
			last7Days.setDate(last7Days.getDate() - 6);
			return { from: setStartOfDay(last7Days), to: setEndOfDay(today) };
		}
	},
	{
		label: "Last 30 days",
		getValue: () => {
			const today = new Date();
			const last30Days = new Date();
			last30Days.setDate(last30Days.getDate() - 29);
			return { from: setStartOfDay(last30Days), to: setEndOfDay(today) };
		}
	},
	{
		label: "Last 90 days",
		getValue: () => {
			const today = new Date();
			const last90Days = new Date();
			last90Days.setDate(last90Days.getDate() - 89);
			return { from: setStartOfDay(last90Days), to: setEndOfDay(today) };
		}
	},
	{
		label: "Last 365 days",
		getValue: () => {
			const today = new Date();
			const last365Days = new Date();
			last365Days.setDate(last365Days.getDate() - 364);
			return { from: setStartOfDay(last365Days), to: setEndOfDay(today) };
		}
	},
	{
		label: "Last month",
		getValue: () => {
			const { from, to } = getLastMonth();
			return { from: setStartOfDay(from!), to: setEndOfDay(to!) };
		}
	},
	{
		label: "Last 12 months",
		getValue: () => {
			const today = new Date();
			const last12Months = new Date();
			last12Months.setFullYear(last12Months.getFullYear() - 1);
			return { from: setStartOfDay(last12Months), to: setEndOfDay(today) };
		}
	},
	{
		label: "Last year",
		getValue: () => {
			const today = new Date();
			const firstDayLastYear = new Date(today.getFullYear() - 1, 0, 1);
			const lastDayLastYear = new Date(today.getFullYear() - 1, 11, 31);
			return {
				from: setStartOfDay(firstDayLastYear),
				to: setEndOfDay(lastDayLastYear)
			};
		}
	}
];

export function DateRangePicker({
	onDateRangeChange,
	initialValue,
	className
}: DateRangePickerProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [date, setDate] = useState<TDateRange>(initialValue || getLastMonth());

	const handlePresetClick = (preset: PresetOption) => {
		setDate(preset.getValue());
	};

	const handleDayClick = (day: Date) => {
		const from = date.from;
		const to = date.to;
		const dayStart = setStartOfDay(day);

		if (!from || !to) {
			setDate({ from: dayStart, to: setEndOfDay(dayStart) });
			return;
		}

		const fromStart = setStartOfDay(from);
		const toStart = setStartOfDay(to);

		if (dayStart < fromStart) {
			setDate({ from: dayStart, to: setEndOfDay(toStart) });
			return;
		}

		if (dayStart > toStart) {
			setDate({ from: fromStart, to: setEndOfDay(dayStart) });
			return;
		}

		const distanceToFrom = dayStart.getTime() - fromStart.getTime();
		const distanceToTo = toStart.getTime() - dayStart.getTime();

		if (distanceToFrom <= distanceToTo) {
			setDate({ from: fromStart, to: setEndOfDay(dayStart) });
			return;
		}

		setDate({ from: dayStart, to: setEndOfDay(toStart) });
	};

	const handleApply = () => {
		if (date.from && date.to) {
			onDateRangeChange?.(date);
			setIsOpen(false);
		}
	};

	return (
		<Popover
			open={isOpen}
			onOpenChange={setIsOpen}
		>
			<PopoverTrigger asChild>
				<div
					onClick={() => setIsOpen(true)}
					className={`flex flex-row items-start md:items-center justify-center gap-3 hover:bg-accent hover:text-accent-foreground bg-white border-border border cursor-pointer ${
						className || "w-[300px] h-9 rounded-[3px] py-1"
					}`}
				>
					<CalendarDays className="mr-3 h-4 w-4" color={COLOR.grey} />
					<span className="font-medium text-sm text-foreground" style={{ color: COLOR.semiBlack }}>
						{date?.from ? (
							date.to ? (
								`${format(date.from, "LLL dd, y")} - ${format(
									date.to,
									"LLL dd, y"
								)} `
							) : (
								format(date.from, "LLL dd, y")
							)
						) : (
							<span>Pick a date</span>
						)}
					</span>
				</div>
			</PopoverTrigger>
			<PopoverContent
				className="w-auto p-0"
				align="start"
				style={{ maxHeight: "var(--radix-popover-content-available-height)", overflowY: "auto" }}
			>
				<div className="flex h-full">
					<div className="border-r w-[200px]  md:flex flex-col items-start gap-2 hidden p-5">
						{presetOptions.map((preset, index) => (
							<Button
								key={index}
								variant="ghost"
								className="w-full text-start justify-start rounded-md"
								onClick={() => handlePresetClick(preset)}
							>
								{preset.label}
							</Button>
						))}
					</div>

					<div className="flex flex-col gap-3 p-5 h-full md:h-auto ">
						<div className="flex md:flex-row flex-col justify-between items-center w-full gap-2">
							<div className="bg-white border-border border rounded-[3px] p-2 w-full font-medium text-sm text-foreground">
								{date.from ? format(date.from, "d MMMM yyyy") : "Start date"}
							</div>

							<div className="md:flex hidden">
								<MoveRight color={COLOR.borderColor} />
							</div>

							<div className="bg-white border-border border rounded-[3px] p-2 w-full font-medium text-sm text-foreground">
								{date.to ? format(date.to, "d MMMM yyyy") : "End date"}
							</div>
						</div>

						<Select
							onValueChange={(label) => {
								const selectedPreset = presetOptions.find(
									(p) => p.label === label
								);
								if (selectedPreset) {
									handlePresetClick(selectedPreset);
								}
							}}
						>
							<SelectTrigger className="md:hidden">
								<SelectValue placeholder="Select" />
							</SelectTrigger>
							<SelectContent position="popper">
								{presetOptions.map((preset, index) => (
									<SelectItem
										key={index}
										value={preset.label}
									>
										{preset.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>

						<Calendar
							initialFocus
							mode="range"
							selected={date}
							numberOfMonths={2}
							onSelect={() => {}}
							onDayClick={handleDayClick}
							showOutsideDays={false}
							fixedWeeks={false}
							className="p-0"
						/>

						<div className="flex flex-col-reverse md:flex-row md:justify-end gap-3 md:flex-1 md:items-end">
							<Button
								variant="secondary"
								onClick={() => setIsOpen(false)}
							>
								Cancel
							</Button>
							<Button
								onClick={handleApply}
								disabled={!date.from || !date.to}
							>
								Apply
							</Button>
						</div>
					</div>
				</div>
			</PopoverContent>
		</Popover>
	);
}
