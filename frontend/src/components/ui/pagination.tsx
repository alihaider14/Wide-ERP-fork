import * as React from "react";
import {
	ChevronFirst,
	ChevronLast,
	ChevronLeftIcon,
	ChevronRightIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./select";
import { COLOR } from "@/constant/Colors";

function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
	return (
		<nav
			role='navigation'
			aria-label='pagination'
			data-slot='pagination'
			className={cn(className)}
			{...props}
		/>
	);
}

function PaginationContent({
	className,
	...props
}: React.ComponentProps<"ul">) {
	return (
		<ul
			data-slot='pagination-content'
			className={cn("flex flex-row items-center ", className)}
			{...props}
		/>
	);
}

function PaginationItem({ ...props }: React.ComponentProps<"li">) {
	return <li data-slot='pagination-item' {...props} />;
}

type PaginationLinkProps = {
	isActive?: boolean;
} & Pick<React.ComponentProps<typeof Button>, "size"> &
	React.ComponentProps<"a">;

function PaginationLink({
	className,
	isActive,
	className: size = "icon",
	...props
}: PaginationLinkProps) {
	return (
		<a
			aria-current={isActive ? "page" : undefined}
			data-slot='pagination-link'
			data-active={isActive}
			className={cn(
				buttonVariants({
					variant: isActive ? "outline" : "ghost",
					className: size,
				}),
				className,
			)}
			{...props}
		/>
	);
}

function PaginationPrevious({
	className,
	...props
}: React.ComponentProps<typeof PaginationLink>) {
	return (
		<PaginationLink
			aria-label='Go to previous page'
			className={cn(className)}
			{...props}
		>
			<ChevronLeftIcon color={props?.color} />
		</PaginationLink>
	);
}

function PaginationFirst({
	className,
	...props
}: React.ComponentProps<typeof PaginationLink>) {
	return (
		<PaginationLink
			aria-label='Go to previous page'
			className={cn(className)}
			{...props}
		>
			<ChevronFirst color={props?.color} />
		</PaginationLink>
	);
}
function PaginationLast({
	className,
	...props
}: React.ComponentProps<typeof PaginationLink>) {
	return (
		<PaginationLink
			aria-label='Go to previous page'
			className={cn(className)}
			{...props}
		>
			<ChevronLast color={props?.color} />
		</PaginationLink>
	);
}

function PaginationNext({
	className,
	...props
}: React.ComponentProps<typeof PaginationLink>) {
	return (
		<PaginationLink
			aria-label='Go to next page'
			className={cn(className)}
			{...props}
		>
			<ChevronRightIcon color={props?.color} />
		</PaginationLink>
	);
}

function SelectRowsPerPage({
	options,
	setPageSize,
	pageSize,
}: {
	options: number[];
	setPageSize: (newSize: number) => void;
	pageSize: number;
}) {
	return (
		<div className='flex items-center gap-1 lg:gap-[14px] lg:w-[157px]'>
			<span className='text-sm tracking-[0.02em] whitespace-nowrap' style={{ color: COLOR.semiBlack }}>
				Rows per page:
			</span>

			<Select
				value={String(pageSize)}
				onValueChange={(value) => setPageSize(Number(value))}
			>
				<SelectTrigger
					className='border-none bg-transparent cursor-pointer'
					color={COLOR?.lightBlack}
				>
					<SelectValue>{String(pageSize)}</SelectValue>
				</SelectTrigger>
				<SelectContent>
					{options.map((option) => (
						<SelectItem key={option} value={String(option)}>
							{option}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
}

export {
	Pagination,
	PaginationContent,
	PaginationLink,
	PaginationItem,
	PaginationPrevious,
	PaginationNext,
	PaginationFirst,
	PaginationLast,
	SelectRowsPerPage,
};
