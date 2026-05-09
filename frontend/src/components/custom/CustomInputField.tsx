import { cn } from "@/lib/utils";
import React from "react";
import { Input } from "../ui/input";
type TProps = {
	value?: string;
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
	className?: string;
	preIcon?: string;
	postIcon?: string;
	placeholder?: string;
	type?: string;
	name?: string;
	onViewPassword?: () => void;
};

const CustomInputField = ({
	onChange,
	value,
	className,
	preIcon,
	postIcon,
	placeholder,
	name,
	type,
	onViewPassword,
	...props
}: React.ComponentProps<"input"> & TProps) => {
	return (
		<div className={cn("relative w-full", className)}>
			{preIcon && (
				<img
					src={preIcon}
					alt='preIcon'
					className='absolute left-[16px] top-1/2 size-5 -translate-y-1/2'
				/>
			)}
			<Input
				placeholder={placeholder}
				value={value || ""}
				onChange={onChange}
				className='pl-11 h-11 '
				type={type}
				name={name}
				autoComplete='on'
				pad
				{...props}
			/>

			{postIcon && (
				<img
					src={postIcon}
					alt='postIcon'
					className='absolute right-5 top-1/2 size-6 -translate-y-1/2 cursor-pointer'
					onClick={onViewPassword}
					width={24}
					height={24}
				/>
			)}
		</div>
	);
};

export default CustomInputField;
