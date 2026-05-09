import { PhotoIcon } from "@/assets/svg";
import { cn, previewImage } from "@/lib/utils";
import React, { useRef, useState } from "react";

type TProps = React.ComponentProps<"input"> & {
	className?: string;
	containerClassName?: string;
	label?: string;
	image?: File | string;
};

const ImagePicker = ({
	className,
	name,
	label,
	containerClassName,
	placeholder,
	disabled,
	image,
	...props
}: TProps) => {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [isLoading, setIsLoading] = useState(true);

	const handleClick = () => {
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
			fileInputRef.current.click();
		}
	};

	return (
		<div className={cn("gap-3 flex flex-col w-full ", containerClassName)}>
			{label && (
				<label
					htmlFor={name}
					className={cn(
						"font-semibold text-sm cursor-pointer w-fit",
						disabled && "cursor-not-allowed",
					)}
				>
					{label}
				</label>
			)}

			<div
				className={cn(
					"rounded size-[100px] border border-borderColor bg-secondary-grey flex flex-row items-center justify-center overflow-hidden cursor-pointer  relative",
					className,
					disabled && "cursor-not-allowed",
				)}
				onClick={handleClick}
			>
				<input
					id={name}
					name={name}
					className='sr-only'
					{...props}
					type='file'
					accept='image/png, image/jpeg'
					ref={fileInputRef}
					disabled={(image && isLoading) || disabled}
				/>

				{image ? (
					<>
						{isLoading && (
							<div className='absolute inset-0 flex items-center justify-center bg-gray-100'>
								<div className='w-8 h-8 border-2 border-primary-400 border-t-transparent rounded-full animate-spin' />
							</div>
						)}
						<img
							src={previewImage(image as File)}
							alt={name}
							className={cn(
								"w-full h-full object-cover ",
								isLoading ? "invisible" : "visible",
							)}
							onLoad={() => setIsLoading(false)}
							onError={() => setIsLoading(false)}
						/>
					</>
				) : (
					<PhotoIcon width={24} height={24} />
				)}

				{placeholder && (
					<span className='text-sm font-semibold text-text-300'>
						{placeholder ?? "Upload Picture"}
					</span>
				)}
			</div>
		</div>
	);
};

export default ImagePicker;
