import { FingerprintScan } from "@/assets/svg";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogTitle,
} from "@/components/ui/dialog";
import { IconX } from "@tabler/icons-react";

interface FingerprintModalProps {
	open: boolean;
	employeeName: string | null;
	isRegistered: boolean;
	onClose: () => void;
	onUpdate: () => void;
}

const FingerprintModal = ({
	open,
	employeeName,
	isRegistered,
	onClose,
	onUpdate
}: FingerprintModalProps) => {
	return (
		<Dialog open={open} onOpenChange={(open) => !open && onClose()}>
			<DialogContent
				className={`w-[400px] ${isRegistered ? "" : "h-[181px]"} rounded-[5px] p-5 gap-5`}
				isCrossIcon={false}
			>
				<div className="flex items-center">
					<DialogTitle className="h-[21px] flex items-center justify-center gap-1 text-sm font-normal leading-[100%] text-center text-semi-black flex-1">
						{isRegistered
							? <span className="font-semibold">FingerPrint Already Registered</span>
							: <><span>Register fingerprint for</span><span className="font-semibold">{employeeName}</span></>}
					</DialogTitle>
					<DialogClose onClick={onClose} className="flex items-center cursor-pointer opacity-70 hover:opacity-100">
						<IconX className="size-5 text-grey" />
					</DialogClose>
				</div>

				{isRegistered && (
					<DialogDescription className="text-sm font-normal leading-[100%] tracking-[0] text-center align-middle">
						<span className="font-semibold">{employeeName}</span>{" "}
						already has a registered fingerprint. Do you want to update it?
					</DialogDescription>
				)}

				<div className="flex justify-center">
					{isRegistered ? (
						<button
							className="flex text-sm items-center justify-center gap-2 bg-red-dark text-white w-87.5 h-9 rounded-[3px] cursor-pointer disabled:bg-disabled disabled:cursor-not-allowed disabled:opacity-60 transition-colors"
							onClick={onUpdate}
						>
							Update FingerPrint
						</button>
					) : (
						<FingerprintScan
							width={100}
							height={100}
							className="text-grey [&_path]:stroke-[1.3]"
						/>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default FingerprintModal;