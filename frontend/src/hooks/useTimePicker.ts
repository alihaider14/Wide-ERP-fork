import { useState } from "react";
import { to12Hour, to24Hour } from "@/helper/time-format";

const useTimePicker = (value: string, onChange: (value: string) => void) => {
	const [open, setOpen] = useState(false);

	const parsed = value ? value.split(":") : null;
	const { hour: h12, period: currentPeriod } = parsed
		? to12Hour(parsed[0])
		: { hour: "", period: "AM" };
	const currentMinute = parsed ? parsed[1] : "";

	const handleHourSelect = (h: string) => {
		const m = currentMinute || "00";
		const p = currentPeriod || "AM";
		onChange(`${to24Hour(h, p)}:${m}`);
	};

	const handleMinuteSelect = (m: string) => {
		const h = h12 || "12";
		const p = currentPeriod || "AM";
		onChange(`${to24Hour(h, p)}:${m}`);
	};

	const handlePeriodSelect = (p: string) => {
		const h = h12 || "12";
		const m = currentMinute || "00";
		onChange(`${to24Hour(h, p)}:${m}`);
		setOpen(false);
	};

	return {
		open,
		setOpen,
		h12,
		currentMinute,
		currentPeriod,
		handleHourSelect,
		handleMinuteSelect,
		handlePeriodSelect,
	};
};

export default useTimePicker;
