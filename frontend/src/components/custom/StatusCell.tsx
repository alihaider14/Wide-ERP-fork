import { cn } from "@/lib/utils";
import React from "react";
import { DEFAULT_STATUS_STYLE, STATUS_STYLES } from "@/constant/statusStyle";

interface StatusCellProps {
	status: string;
	className?: string;
}

const StatusCell: React.FC<StatusCellProps> = ({ status, className }) => {
	const normalized = status.trim().toLowerCase();
	const style = STATUS_STYLES[normalized] ?? DEFAULT_STATUS_STYLE;

	return (
		<div
			className={cn(
				`inline-flex h-6 w-[100px] items-center justify-center rounded-[3px] border-[0.5px] px-1 text-center text-[12px] font-medium leading-none
        ${style.bg} ${style.text} ${style.border}`,
				className,
			)}
		>
			<span className='block capitalize leading-none'>
				{status.toLowerCase()}
			</span>
		</div>
	);
};

export default StatusCell;
