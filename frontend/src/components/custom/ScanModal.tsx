import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import CustomAutocomplete from "./CustomAutocomplete";
import { useQuery } from "@tanstack/react-query";
import { getShopsIdAndName } from "@/services/shop-service";
import { useRef, useState } from "react";
import { TScanParcel } from "@/types/shopify";
import useScanDetection from "use-scan-detection";
import toast from "react-hot-toast";

type TProps = {
	open: boolean;
	handleCancel?: () => void;
	handleScan: (data: TScanParcel) => void;
	mode?: "scan" | "return";
};

const ScanModal = ({ open, handleCancel, handleScan, mode }: TProps) => {
	const inputRef = useRef<HTMLInputElement | null>(null);
	const [data, setData] = useState<TScanParcel>({
		shopId: "",
		orderNo: "",
	});
	const [connected, setConnected] = useState(false);

	const { data: shops } = useQuery({
		queryKey: ["shops-simple"],
		queryFn: getShopsIdAndName,
		enabled: !!open,
	});

	useScanDetection({
		onComplete: (code) => {
			if (!open) return;

			const data = String(code).replace(/Shift/g, "");
			const [shopId, orderNo] = data.split("|");

			setConnected(true);

			if (shopId && orderNo) {
				handleScan({ shopId, orderNo });
				setTimeout(() => setConnected(false), 3000);
			} else toast.error("Invalid qrcode scanned.");
		},
		onError: () => {
			if (!open) return;
			toast.error("Scan error");
		},
		minLength: 5,
	});

	return (
		<Dialog open={open}>
			<DialogContent
				onClose={() => {
					setData({ shopId: "", orderNo: "" });
					handleCancel?.();
				}}
				className='sm:max-w-[400px] gap-5  p-5 rounded-[5px]'
				aria-describedby={undefined}
				crossIconClassName='top-1'
			>
				<DialogTitle className='text-black'>
					{mode === "return" ? "Scan Return Parcel" : "Scan Parcel"}
				</DialogTitle>

				<Input
					placeholder='Scan or manually enter the order no'
					name='orderNo'
					label='Order No.'
					value={data?.orderNo || ""}
					onChange={(e) => {
						setData((prev) => ({
							...prev,
							orderNo: e.target.value,
						}));
					}}
					ref={inputRef}
				/>

				<CustomAutocomplete
					data={
						shops?.map((shop) => ({
							name: shop.name,
							id: shop.id,
						})) || []
					}
					placeholder='Shop'
					label='Shop'
					name='shopId'
					value={data?.shopId ?? ""}
					onChange={(e) =>
						setData((prev) => ({
							...prev,
							shopId: e.target.value,
						}))
					}
					handleSelect={(item) => {
						setData((prev) => ({
							...prev,
							shopId: item.id,
						}));
					}}
				/>

				<div className='flex flex-row justify-between items-center gap-5'>
					<div className='flex flex-row gap-2 items-center'>
						<div
							className={cn(
								`rounded-full size-2 bg-green-500`,
								!connected && "bg-red-dark",
							)}
						/>

						<span className='text-grey text-xs'>
							Scanner is {connected ? "connected" : "disconnected"}
						</span>
					</div>

					<Button
						onClick={() => {
							handleScan(data);
							setData({ shopId: "", orderNo: "" });
						}}
					>
						Scan
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default ScanModal;
