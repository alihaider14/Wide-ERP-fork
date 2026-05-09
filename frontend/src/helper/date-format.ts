import { format } from "date-fns";
import { toStableLocalDate } from "./payment-date";

export function isoToDDMMYYYY(iso: string): string {
	if (!iso) return "";
	const d = new Date(iso);
	if (isNaN(d.getTime())) return iso;
	const day = String(d.getDate()).padStart(2, "0");
	const month = String(d.getMonth() + 1).padStart(2, "0");
	const year = d.getFullYear();
	return `${day}-${month}-${year}`;
}

export function formatDateQueryParam(date: Date): string {
	return format(date, "yyyy-MM-dd");
}

export function setStartOfDay(date: Date): Date {
	const d = new Date(date);
	d.setHours(0, 0, 0, 0);
	return d;
}

export function setEndOfDay(date: Date): Date {
	const d = new Date(date);
	d.setHours(23, 59, 59, 999);
	return d;
}

export function getStartOfToday(): Date {
	return setStartOfDay(new Date());
}

export function getEndOfToday(): Date {
	return setEndOfDay(new Date());
}

export function checkFutureMonth(
	monthIndex: number,
	year: number,
	referenceDate: Date = new Date(),
): boolean {
	const referenceYear = referenceDate.getFullYear();
	const referenceMonth = referenceDate.getMonth();

	return year > referenceYear || (year === referenceYear && monthIndex > referenceMonth);
}

export function checkFutureDate(
	date: Date,
	referenceDate: Date = new Date(),
): boolean {
	const selectedDate = new Date(
		date.getFullYear(),
		date.getMonth(),
		date.getDate(),
	);
	const currentDate = new Date(
		referenceDate.getFullYear(),
		referenceDate.getMonth(),
		referenceDate.getDate(),
	);

	return selectedDate.getTime() > currentDate.getTime();
}

export function formatShortMonthDayYear(dateValue?: string | Date): string {
	if (!dateValue) {
		return "-";
	}

	const date =
		typeof dateValue === "string"
			? toStableLocalDate(dateValue)
			: new Date(dateValue);

	if (Number.isNaN(date.getTime())) {
		return "-";
	}

	return format(date, "LLL d, yyyy");
}

export function formatDateTimeLocalValue(dateValue: Date = new Date()): string {
	const year = dateValue.getFullYear();
	const month = String(dateValue.getMonth() + 1).padStart(2, "0");
	const day = String(dateValue.getDate()).padStart(2, "0");
	const hours = String(dateValue.getHours()).padStart(2, "0");
	const minutes = String(dateValue.getMinutes()).padStart(2, "0");

	return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export function parseDateTimeLocalValue(dateValue?: string): Date | undefined {
	if (!dateValue) {
		return undefined;
	}

	const date = new Date(dateValue);

	if (Number.isNaN(date.getTime())) {
		return undefined;
	}

	return date;
}

export function formatManualAttendanceDateTime(dateValue?: string | Date): string {
	if (!dateValue) {
		return "";
	}

	const date =
		typeof dateValue === "string"
			? parseDateTimeLocalValue(dateValue)
			: new Date(dateValue);

	if (!date || Number.isNaN(date.getTime())) {
		return "";
	}

	return format(date, "LLL d, yyyy — hh:mm aa");
}

export function formatTimeLocalValue(dateValue: Date = new Date()): string {
	const hours = String(dateValue.getHours()).padStart(2, "0");
	const minutes = String(dateValue.getMinutes()).padStart(2, "0");

	return `${hours}:${minutes}`;
}
