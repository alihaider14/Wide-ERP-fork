import React from "react";
import {
	Table,
	TableBody,
	TableHead,
	TableHeader,
	TableRow,
} from "../ui/table";
import { cn } from "@/lib/utils";
import {
	IconSortAscending2,
	IconSortDescending2,
	IconArrowsSort,
} from "@tabler/icons-react";

export type THead = {
	title: React.ReactNode;
	className?: string;
	sortable?: boolean;
	sortKey?: string;
};

type TProps = {
	head: THead[];
	children: React.ReactNode;
	sortBy?: string;
	sortOrder?: "asc" | "desc";
	onSort?: (key: string) => void;
	headerRowHeight?: string;
	bodyRowHeight?: string;
	bodyCellPaddingY?: string;
	rowClassName?: string;
};

const SimpleTable = ({
	head,
	children,
	sortBy,
	sortOrder,
	onSort,
	headerRowHeight = "60px",
	bodyRowHeight,
	bodyCellPaddingY,
	rowClassName,
}: TProps) => {
	return (
		<Table>
			<TableHeader>
				<TableRow
					className={cn(
						"w-full border-t border-b border-borderColor bg-secondary-grey opacity-100 px-10 py-3.5 justify-between items-center",
						rowClassName,
					)}
					style={{ boxSizing: "border-box", height: headerRowHeight }}
				>
					{head.map((item, index) => {
						const isSorted =
							item.sortable && item.sortKey && sortBy === item.sortKey;
						return (
							<TableHead
								key={index}
								className={cn("", item?.className)}
								onClick={
									item.sortable && item.sortKey && onSort
										? () => onSort(item.sortKey!)
										: undefined
								}
								style={
									item.sortable ? { cursor: "pointer", userSelect: "none" } : {}
								}
							>
								{item?.title}
								{item.sortable &&
									item.sortKey &&
									(!isSorted ? (
										<IconArrowsSort
											size={16}
											className='inline ml-1 text-gray-400'
										/>
									) : sortOrder === "asc" ? (
										<IconSortAscending2 size={16} className='inline ml-1' />
									) : (
										<IconSortDescending2 size={16} className='inline ml-1' />
									))}
							</TableHead>
						);
					})}
				</TableRow>
			</TableHeader>
			<TableBody
				style={
					{
						"--row-height": bodyRowHeight,
						"--cell-py": bodyCellPaddingY,
					} as React.CSSProperties
				}
			>
				{children}
			</TableBody>
		</Table>
	);
};

export default SimpleTable;
