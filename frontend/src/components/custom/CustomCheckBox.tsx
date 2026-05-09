import { cn } from "@/lib/utils";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";

type TProps = {
	name?: string;
	label?: string;
	handleCheck: (isChecked: boolean) => void;
	checked: boolean;
	containerClassName?: string;
	labelClassName?: string;
	className?: string;
	checkIcon?: string;
	iconWidth?: number;
	iconHeight?: number;
};

const CustomCheckBox = ({
	name,
	label,
	checked,
	handleCheck,
	containerClassName,
	labelClassName,
	className,
	checkIcon,
	iconHeight = 14,
	iconWidth = 14,
}: TProps) => {
	return (
		<div className={cn(`flex items-center gap-3`, containerClassName)}>
			<Checkbox
				id={name}
				checked={checked}
				onCheckedChange={() => handleCheck(checked)}
				className={cn(
					"border-[1.5px] border-grey size-[18px] data-[state=checked]:border-primary",
					className,
				)}
				checkIcon={checkIcon}
				width={iconWidth}
				height={iconHeight}
			/>
			{label && (
				<Label
					htmlFor={name}
					className={cn(
						`text-sm text-foreground cursor-pointer`,
						labelClassName,
					)}
				>
					{label}
				</Label>
			)}
		</div>
	);
};

export default CustomCheckBox;
