import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { HOURS_12, MINUTES, PERIODS, formatTimeDisplay } from "@/helper/time-format";
import useTimePicker from "@/hooks/useTimePicker";

interface TimePickerProps {
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	className?: string;
}

function ScrollColumn({
	items,
	selected,
	onSelect,
}: {
	items: readonly string[];
	selected: string;
	onSelect: (val: string) => void;
}) {
	const containerRef = useRef<HTMLDivElement>(null);
	const selectedRef = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		if (selectedRef.current && containerRef.current) {
			selectedRef.current.scrollIntoView({ block: "center" });
		}
	}, [selected]);

	return (
		<div
			ref={containerRef}
			className='flex flex-col h-[200px] overflow-y-auto scrollbar-thin px-1'
		>
			{items.map((item) => (
				<button
					key={item}
					ref={item === selected ? selectedRef : undefined}
					type='button'
					onClick={() => onSelect(item)}
					className={cn(
						"px-3 py-1.5 text-sm rounded-[3px] cursor-pointer shrink-0 transition-colors",
						item === selected
							? "bg-primary text-white font-medium"
							: "hover:bg-gray-100 text-semi-black",
					)}
				>
					{item}
				</button>
			))}
		</div>
	);
}

function TimePicker({ value, onChange, placeholder = "Select Time", className }: TimePickerProps) {
	const {
		open,
		setOpen,
		h12,
		currentMinute,
		currentPeriod,
		handleHourSelect,
		handleMinuteSelect,
		handlePeriodSelect,
	} = useTimePicker(value, onChange);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant='outline'
					type='button'
					className={cn(
						"justify-start border border-borderColor rounded-[3px] bg-white px-2 md:px-4 py-[6px] text-left font-poppins text-sm font-normal leading-[100%] shadow-none hover:bg-white hover:text-foreground h-9",
						value ? "text-semi-black" : "text-grey",
						className,
					)}
				>
					{value ? formatTimeDisplay(value) : placeholder}
				</Button>
			</PopoverTrigger>
			<PopoverContent className='w-auto p-2' align='start'>
				<div className='flex gap-1'>
					<div className='flex flex-col items-center'>
						<span className='text-xs font-medium text-grey mb-1'>Hr</span>
						<ScrollColumn items={HOURS_12} selected={h12} onSelect={handleHourSelect} />
					</div>
					<div className='w-px bg-borderColor' />
					<div className='flex flex-col items-center'>
						<span className='text-xs font-medium text-grey mb-1'>Min</span>
						<ScrollColumn items={MINUTES} selected={currentMinute} onSelect={handleMinuteSelect} />
					</div>
					<div className='w-px bg-borderColor' />
					<div className='flex flex-col items-center'>
						<span className='text-xs font-medium text-grey mb-1'>&nbsp;</span>
						<ScrollColumn items={PERIODS} selected={currentPeriod} onSelect={handlePeriodSelect} />
					</div>
				</div>
			</PopoverContent>
		</Popover>
	);
}

export default TimePicker;
