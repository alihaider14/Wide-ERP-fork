export function formatDateToLocaleString(dateString?: Date, format: string = 'default') {
	if (!dateString) return "N/A";

	const date = new Date(dateString);

	if (format === 'MM/DD/YYYY') {
		return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
	} else if (format === 'MMM D, YYYY') {
		return date.toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
		});
	}

	return date.toDateString();
}

export function formatDateTimeToLocaleString(dateString?: Date) {
	if (!dateString) return "N/A";

	const date = new Date(dateString);
	const options: Intl.DateTimeFormatOptions = {
		year: "numeric",
		month: "short", // ("short" gives "Apr")
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		hour12: true
	};

	return date.toLocaleDateString("en-US", options);
}

export const getLastMonth = () => {
	const today = new Date();
	const firstDayLastMonth = new Date(
		today.getFullYear(),
		today.getMonth() - 1,
		1
	);
	const lastDayLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
	return { from: firstDayLastMonth, to: lastDayLastMonth };
};

export const formatDateOnly = (dateStr?: string): string => {
	if (!dateStr) return "-";
	return new Date(dateStr).toLocaleDateString("en-US", {
		weekday: "short",
		month: "short",
		day: "2-digit",
		year: "numeric",
	});
};

export const formatCheckInOut = (checkIn?: string, checkOut?: string): string => {
	if (!checkIn) return "-";
	const inTime = new Date(checkIn).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
	if (!checkOut) return `${inTime} - Working`;
	const outTime = new Date(checkOut).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
	return `${inTime} - ${outTime}`;
};

export const formatDuration = (minutes?: number): string => {
	if (minutes == null) return "-";
	const h = Math.floor(minutes / 60);
	const m = minutes % 60;
	return `${h}h ${m}m`;
};