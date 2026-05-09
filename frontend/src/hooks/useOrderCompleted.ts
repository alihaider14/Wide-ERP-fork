import { handlePrint } from "@/components/custom/PrintReceipt";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const useOrderCompleted = () => {
	const navigate = useNavigate();
	const { state } = useLocation();
	const [count, setCount] = useState(3);
	const [isBtnDisabled, setIsBtnDisabled] = useState(true);

	useEffect(() => {
		const timer = setInterval(() => {
			setCount((prev) => {
				if (prev === 1) {
					clearInterval(timer);
					setIsBtnDisabled(false);
					return 0;
				}
				return prev - 1;
			});
		}, 1000);

		return () => clearInterval(timer);
	}, []);

	if (!state?.order) navigate("/orders");

	const { orderId } = state.order;
	const { recieved_amount, total_amount } = state?.order || {};

	const changeDue = useMemo(() => {
		const due = (Number(recieved_amount) || 0) - (Number(total_amount) || 0);

		return due.toLocaleString("en-US", {
			maximumFractionDigits: 2,
			minimumFractionDigits: 2
		});
	}, [total_amount, recieved_amount]);

	const handleReprintReceipt = () => {
		handlePrint(state?.order, state?.cart);
	};

	return {
		_id: orderId,
		isBtnDisabled,
		count,
		changeDue,
		navigate,
		handleReprintReceipt
	};
};
export default useOrderCompleted;
