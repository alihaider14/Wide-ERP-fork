import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import TimePicker from "./TimePicker";
import { TWorkingHourEntry } from "@/types/Employee";

interface WorkingHoursSectionProps {
	workingHours: TWorkingHourEntry[];
	handleDayToggle: (index: number, checked: boolean) => void;
	handleTimeChange: (
		index: number,
		field: "start_time" | "end_time",
		value: string,
	) => void;
}

function WorkingHoursSection({
	workingHours,
	handleDayToggle,
	handleTimeChange,
}: WorkingHoursSectionProps) {
	return (
		<div className='flex flex-col gap-3 md:gap-[20px]'>
			<Label className='h-[21px] flex items-center text-sm font-medium leading-[100%] text-semi-black'>Working Hours</Label>
			<div className='flex flex-col gap-3 md:gap-[20px]'>
				{workingHours.map((entry, index) => (
					<div
						key={`${entry.day}-${index}`}
						className='flex items-center gap-2 md:gap-[20px]'
					>
						<div className='flex items-center gap-2 md:gap-[20px] w-[110px] md:w-[140px] shrink-0'>
							<div className='size-5 shrink-0 flex items-center justify-center'>
								<Checkbox
									className='size-[16px] rounded-[2px] border-[1.5px] border-grey data-[state=checked]:border-primary'
									checked={entry.is_working_day}
									onCheckedChange={(checked) =>
										handleDayToggle(index, checked === true)
									}
								/>
							</div>
							<span className='text-sm font-normal text-semi-black'>
								{entry.day}
							</span>
						</div>
						<TimePicker
							placeholder='Start Time'
							value={entry.start_time || ""}
							onChange={(val) => handleTimeChange(index, "start_time", val)}
							className='flex-1 min-w-0 2xl:flex-none 2xl:w-[200px]'
						/>
						<div className='w-3 md:w-[30px] shrink-0 border-t border-borderColor' />
						<TimePicker
							placeholder='End Time'
							value={entry.end_time || ""}
							onChange={(val) => handleTimeChange(index, "end_time", val)}
							className='flex-1 min-w-0 2xl:flex-none 2xl:w-[200px]'
						/>
					</div>
				))}
			</div>
		</div>
	);
}

export default WorkingHoursSection;
