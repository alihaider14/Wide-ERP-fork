"use client";

import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import * as React from "react";

import { cn } from "@/lib/utils";
import { Check } from "@/assets/svg";

function Checkbox({
	className,
	checkIcon = Check,
	width = 14,
	height = 14,
	...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root> & {
	checkIcon?: string;
	width?: number;
	height?: number;
}) {
	return (
		<CheckboxPrimitive.Root
			data-slot='checkbox'
			className={cn(
				"peer border-input data-[state=checked]:bg-primary cursor-pointer data-[state=checked]:text-primary-foreground data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[2px] border outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-500",
				className,
			)}
			{...props}
		>
			<CheckboxPrimitive.Indicator
				data-slot='checkbox-indicator'
				className='grid place-content-center text-current'
			>
				{props.checked === "indeterminate" ? (
					<svg
						width='9'
						height='9'
						viewBox='0 0 9 9'
						fill='currentcolor'
						xmlns='http://www.w3.org/2000/svg'
					>
						<path
							fillRule='evenodd'
							clipRule='evenodd'
							d='M0.75 4.5C0.75 4.08579 1.08579 3.75 1.5 3.75H7.5C7.91421 3.75 8.25 4.08579 8.25 4.5C8.25 4.91421 7.91421 5.25 7.5 5.25H1.5C1.08579 5.25 0.75 4.91421 0.75 4.5Z'
						/>
					</svg>
				) : (
					<img src={checkIcon} alt='Check' width={width} height={height} />
				)}
			</CheckboxPrimitive.Indicator>
		</CheckboxPrimitive.Root>
	);
}

export { Checkbox };
