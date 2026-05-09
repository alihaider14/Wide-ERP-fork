import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

type TProps = {
	open: boolean;
	title: string;
	description: string;
	handleSumbit?: () => void;
	sumbitButtonText: string;
	sumbitButtonVariant?:
		| "default"
		| "destructive"
		| "outline"
		| "secondary"
		| "ghost"
		| "link"
		| null
		| undefined;
	cancelButtonText: string;
	handleCancel?: () => void;
};

const Prompt = ({
	open,
	title,
	description,
	handleSumbit,
	cancelButtonText,
	handleCancel,
	sumbitButtonText,
	sumbitButtonVariant,
}: TProps) => {
	return (
		<Dialog open={open} onOpenChange={handleCancel}>
			<DialogContent
				className='sm:max-w-[500px] sm:py-[30px] sm:px-10 py-[15px] px-5 gap-[30px]'
				isCrossIcon={false}
			>
				<DialogHeader className='text-center gap-[30px] '>
					<DialogTitle>{title}</DialogTitle>
					<DialogDescription>{description}</DialogDescription>
				</DialogHeader>

				<DialogFooter className='gap-[30px] justify-center items-center'>
					<Button
						onClick={handleSumbit}
						variant={sumbitButtonVariant}
						className='w-full sm:max-w-[350px]'
					>
						{sumbitButtonText}
					</Button>
					<Button
						onClick={handleCancel}
						variant='secondary'
						className='w-full sm:max-w-[350px]'
					>
						{cancelButtonText}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default Prompt;
