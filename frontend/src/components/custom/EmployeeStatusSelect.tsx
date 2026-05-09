import { EMPLOYEE_STATUSES } from "@/constant/Employee";
import useEmployeeStatusSelect from "@/hooks/useEmployeeStatusSelect";
import { TEmployeeStatus } from "@/types/Employee";
import React from "react";
import StatusCell from "./StatusCell";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

interface EmployeeStatusSelectProps {
	status: TEmployeeStatus;
	onChange: (status: TEmployeeStatus) => void;
	disabled?: boolean;
	className?: string;
}

const EmployeeStatusSelect: React.FC<EmployeeStatusSelectProps> = ({
	status,
	onChange,
	disabled = false,
	className,
}) => {
	const { open, handleOpenChange, handleStatusClick } = useEmployeeStatusSelect({
		status,
		onChange,
	});

	return (
		<div className='w-[100px]'>
			<Popover open={open && !disabled} onOpenChange={handleOpenChange}>
				<PopoverTrigger asChild>
					<button
						type='button'
						className='block w-[100px] cursor-pointer border-0 bg-transparent p-0 text-left shadow-none outline-none disabled:cursor-not-allowed disabled:opacity-100'
						disabled={disabled}
					>
						<StatusCell status={status} className={className} />
					</button>
				</PopoverTrigger>

				<PopoverContent
					align='start'
					sideOffset={4}
					className='z-[70] h-[148px] w-[100px] overflow-hidden rounded-[4px] border border-border bg-white p-0 shadow-none'
					style={{ boxShadow: "0px 4px 4px 0px #0000001A" }}
				>
					{EMPLOYEE_STATUSES.map((option) => (
						<button
							key={option}
							type='button'
							className='flex h-[37px] w-[100px] cursor-pointer items-center justify-center gap-2.5 border-b-[0.5px] border-borderColor/50 p-2 text-center text-sm text-deepNavy last:border-b-0 hover:bg-gray-100'
							onClick={() => handleStatusClick(option)}
						>
							{option}
						</button>
					))}
				</PopoverContent>
			</Popover>
		</div>
	);
};

export default EmployeeStatusSelect;
