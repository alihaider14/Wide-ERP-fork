import { HOURS_12, MINUTES, PERIODS } from "@/constant/time";

export { HOURS_12, MINUTES, PERIODS };

export const to12Hour = (h24: string) => {
	const num = parseInt(h24, 10);
	const period = num >= 12 ? "PM" : "AM";
	const hour = String(num % 12 || 12).padStart(2, "0");
	return { hour, period };
};

export const to24Hour = (h12: string, period: string) => {
	let num = parseInt(h12, 10);
	if (period === "AM" && num === 12) num = 0;
	else if (period === "PM" && num !== 12) num += 12;
	return String(num).padStart(2, "0");
};

export const formatTimeDisplay = (value: string) => {
	const [h24, m] = value.split(":");
	const { hour, period } = to12Hour(h24);
	return `${hour}:${m} ${period}`;
};

export const getTimeInMinutes = (time: string): number => {
	const [hours, minutes] = time.split(":").map(Number);
	return (hours * 60) + minutes;
};
