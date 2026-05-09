import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { COLOR } from "@/constant/Colors";
import { IconX } from "@tabler/icons-react";
import { ReactNode } from "react";

type TProps = {
	open: boolean;
	title: string;
	description: ReactNode;
	confirmText?: string;
	confirmLoadingText?: string;
	handleDelete: () => void;
	handleCancel: () => void;
	isDeleting?: boolean;
};

export const DeletionConfirmation = ({
	open,
	title,
	description,
	confirmText = "Delete",
	confirmLoadingText = "Deleting...",
	handleDelete,
	handleCancel,
	isDeleting = false,
}: TProps) => {
	return (
		<Dialog open={open} onOpenChange={handleCancel}>
			<DialogContent 
				className='sm:max-w-[500px] sm:py-[30px] sm:px-10 py-[15px] px-5 gap-[20px] rounded-[5px]'
				isCrossIcon={false}
			>
				<DialogHeader className='text-center gap-[20px]'>
					<div className='relative inline-block'>
						<DialogTitle className='inline'>{title}</DialogTitle>
						<DialogClose asChild>
							<button
								onClick={handleCancel}
								className='absolute w-6 h-6 flex items-center justify-center cursor-pointer'
								style={{
									left: '100%',
									bottom: '50%',
								}}
							>
								<IconX className='w-6 h-6' color={COLOR.semiBlack} />
							</button>
						</DialogClose>
					</div>
					<DialogDescription>{description}</DialogDescription>
				</DialogHeader>

				<DialogFooter className='justify-center items-center'>
					<Button
						onClick={handleDelete}
						className='w-[350px] h-9 rounded-[3px] opacity-100 cursor-pointer'
						style={{ backgroundColor: COLOR.red }}
						disabled={isDeleting}
					>
						{isDeleting ? confirmLoadingText : confirmText}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
