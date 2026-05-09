import { updateShopifyOrderStatus } from "@/services/shopifyorders";
import React, { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import { COLOR } from "@/constant/Colors";

interface StatusSelectProps {
	status: string;
	onChange: (value: string) => void;
	order: {
		shopId: string;
		orderId: string;
	};
	activeStatus: string;
}

const StatusSelect: React.FC<StatusSelectProps> = ({
	status,
	order,
	onChange,
	activeStatus,
}) => {
	const [open, setOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	const isDropdownEnabled =
		activeStatus === "Pending" || activeStatus === "Ready to Ship";

	const getOptions = (currentStatus: string): string[] => {
    if (currentStatus === "Booked") return ["Cancelled"];
    return ["Pending", "Ready to Ship", "Cancelled"];
  };

	const updateStatus = async (newStatus: string) => {
		try {
			await updateShopifyOrderStatus(order.shopId, order.orderId, newStatus);
			onChange(newStatus);
			toast.success("Order status updated successfully.");
		} catch {
			toast.error("Order status failed updating.");
		}
		setOpen(false);
	};

	// Close dropdown when clicking outside
	useEffect(() => {
		const handler = (e: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(e.target as Node)
			) {
				setOpen(false);
			}
		};
		document.addEventListener("mousedown", handler);
		return () => document.removeEventListener("mousedown", handler);
	}, []);

  const statusStyles: Record<string, { border: string; text: string; background: string }> = {
    Pending: { border: COLOR.grey, text: COLOR.grey, background: COLOR.transparent },
    "Ready to Ship": { border: COLOR.purple, text: COLOR.purple, background: COLOR.purpleBg },
    Booked: { border: COLOR.orange, text: COLOR.orange, background: COLOR.orangeBg },
    Scanned: { border: COLOR.blue, text: COLOR.blue, background: COLOR.blueBg },
    "In-Transit": { border: COLOR.teal, text: COLOR.teal, background: COLOR.tealBg },
    "Out for Delivery": { border: COLOR.teal, text: COLOR.teal, background: COLOR.tealBg },
    Attempted: { border: COLOR.teal, text: COLOR.teal, background: COLOR.tealBg },
    Failed: { border: COLOR.brown, text: COLOR.brown, background: COLOR.brownBg },
    Delivered: { border: COLOR.green, text: COLOR.green, background: COLOR.greenBg },
    "Rec. Return": { border: COLOR.darkRed, text: COLOR.darkRed, background: COLOR.redBg },
    Cancelled: { border: COLOR.darkRed, text: COLOR.darkRed, background: COLOR.redBg },
  };

  const statusDisplayText: Record<string, string> = {
    "Out for Delivery": "Out for Del.",
    Failed: "Del. Failed",
  };

	return (
		<div
			className='relative inline-block text-xs font-medium'
			ref={dropdownRef}
		>
			<button
				onClick={() => isDropdownEnabled && setOpen(!open)}
				className={`w-[100px] h-6 px-1 py-[3px] border-[0.5px] rounded-[3px] text-center ${
					isDropdownEnabled ? "cursor-pointer" : "cursor-default"
				}`}
				style={{
					borderColor: statusStyles[status]?.border,
					color: statusStyles[status]?.text,
					backgroundColor: statusStyles[status]?.background,
				}}
			>
				{statusDisplayText[status] || status}
			</button>

			{open && isDropdownEnabled && (
				<div className='absolute left-0 mt-1 w-30 bg-white border rounded-[3px] shadow-lg z-50'>
					{getOptions(status).map((item, index, arr) => (
						<div
							key={item}
							onClick={() => updateStatus(item)}
							className={`
							font-normal
							pr-2 pl-4 py-3
							text-left
							text-deepNavy
							hover:bg-gray-100
							cursor-pointer
								${index !== arr.length - 1 ? "border-b border-gray-200" : ""}

              `}
						>
							{item}
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default StatusSelect;
