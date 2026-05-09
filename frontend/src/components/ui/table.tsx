import * as React from "react";
import { cn } from "@/lib/utils";
import { COLOR } from "@/constant/Colors";

function Table({ className, ...props }: React.ComponentProps<"table">) {
	return (
		<div
			data-slot='table-container'
			className='relative w-full overflow-x-auto'
		>
			<table
				data-slot='table'
				className={cn("w-full caption-bottom text-sm table-auto", className)}
				{...props}
			/>
		</div>
	);
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
	return (
		<thead
			data-slot='table-header'
			className={cn("[&_tr]:border-b", className)}
			{...props}
		/>
	);
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
	return (
		<tbody
			data-slot='table-body'
			className={cn("[&_tr:last-child]:border-b", className)}
			{...props}
		/>
	);
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
	return (
		<tfoot
			data-slot='table-footer'
			className={cn(
				"h-[60px] border-t font-medium [&>tr]:last:border-b-0",
				className,
			)}
			{...props}
		/>
	);
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
	return (
		<tr
			data-slot='table-row'
			className={cn(
				"hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors h-[var(--row-height,60px)]",
				className,
			)}
			{...props}
		/>
	);
}

function TableHead({ className, style, ...props }: React.ComponentProps<"th">) {
	return (
		<th
			data-slot='table-head'
			className={cn(
				"h-10  min-w-[140px] w-auto px-2 text-left text-nowrap align-middle text-sm leading-[21px] font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
				className,
			)}
			style={{ color: COLOR.semiBlack, ...style }}
			{...props}
		/>
	);
}

function TableCell({ className, style, ...props }: React.ComponentProps<"td">) {
	return (
		<td
			data-slot='table-cell'
			className={cn(
				"px-2 py-[var(--cell-py,8px)] align-middle whitespace-nowrap text-nowrap text-sm leading-[21px] font-normal  [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
				className,
			)}
			style={{ color: COLOR.semiBlack, ...style }}
			{...props}
		/>
	);
}

function TableCaption({
	className,
	...props
}: React.ComponentProps<"caption">) {
	return (
		<caption
			data-slot='table-caption'
			className={cn("text-muted-foreground mt-4 text-sm", className)}
			{...props}
		/>
	);
}

export {
	Table,
	TableHeader,
	TableBody,
	TableFooter,
	TableHead,
	TableRow,
	TableCell,
	TableCaption,
};
