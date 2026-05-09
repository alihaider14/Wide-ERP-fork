import { formatTimeDisplay } from "@/helper/time-format";
import { TWorkingHoursCardProps } from "@/types/Employee";

const WorkingHoursCard = ({ workingHours }: TWorkingHoursCardProps) => {
	return (
		<div className='w-full rounded-[5px] border border-borderColor bg-white p-5 md:p-10'>
			<div className='flex flex-col gap-5'>
				<h2 className='h-[30px] font-poppins text-[20px] font-medium leading-[100%] tracking-[0] text-semi-black flex items-center'>
					Working Hours
				</h2>
				<div className='flex flex-wrap gap-x-10 gap-y-5'>
					{workingHours.map((entry) => (
						<div
							key={entry.day}
							className='flex w-[250px] h-[21px] items-center gap-2'
						>
							<span className='shrink-0 font-poppins text-[14px] font-normal leading-[100%] tracking-[0] text-semi-black'>
								{entry.day}:
							</span>
							<span className='font-poppins text-[14px] font-medium leading-[100%] tracking-[0] text-semi-black'>
								{entry.is_working_day && entry.start_time && entry.end_time
									? `${formatTimeDisplay(entry.start_time)} – ${formatTimeDisplay(entry.end_time)}`
									: "OFF"}
							</span>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default WorkingHoursCard;
