export function formatDateToLocaleString(dateString?: Date) {
	if (!dateString) return "N/A";

	const date = new Date(dateString);

	return date.toDateString();
}

export function formatDateTimeToLocaleString(dateString?: Date) {
	if (!dateString) return "N/A";

	const date = new Date(dateString);
	const timeZone = "Asia/Karachi";

	const datePart = date.toLocaleDateString("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
		timeZone,
	});

	const timePart = date.toLocaleTimeString("en-US", {
		hour: "2-digit",
		minute: "2-digit",
		hour12: true,
		timeZone,
	});

	return `${datePart} - ${timePart}`;
}

export function daysBetween(start: string, end: string): number {
	const diff = new Date(end).getTime() - new Date(start).getTime();
	return Math.max(Math.ceil(diff / (1000 * 60 * 60 * 24)), 1);
}

export function getTimeInMinutes(time: string): number {
	const [hours, minutes] = time.split(":").map(Number);
	return (hours * 60) + minutes;
}
