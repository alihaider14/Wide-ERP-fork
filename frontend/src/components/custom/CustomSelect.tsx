import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@/components/ui/select";
import { COLOR } from "@/constant/Colors";
import { cn } from "@/lib/utils";

export type TCustomSelect = {
	label: string;
	value: string;
};

type TProps = {
	value?: string;
	onValueChange: (value: string) => void;
	data: TCustomSelect[];
	placeholder?: string;
	containerClassName?: string;
	label?: string;
};

export default function CustomSelect({
	value,
	onValueChange,
	data,
	placeholder = "",
	containerClassName,
	label
}: TProps) {
	return (
		<div className={cn("flex flex-col gap-1", containerClassName)}>
			{label && (
				<span className="text-foreground font-normal text-xs leading-[18px]">
					{label}
				</span>
			)}

			<Select
				value={value}
				onValueChange={onValueChange}
			>
				<SelectTrigger
					className="text-sm font-normal text-foreground cursor-pointer"
					color={COLOR?.grey}
				>
					<SelectValue placeholder={placeholder} />
				</SelectTrigger>
				<SelectContent>
					{data?.map((item, index) => {
						return (
							<SelectItem
								key={index}
								value={item.value}
								className="cursor-pointer"
							>
								{item.label}
							</SelectItem>
						);
					})}
				</SelectContent>
			</Select>
		</div>
	);
}
