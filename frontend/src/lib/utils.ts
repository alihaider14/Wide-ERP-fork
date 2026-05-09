import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { differenceInDays, addDays, format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const previewImage = (files: File) => {
	if (typeof files === "string") return files;

	const file = files;

	return URL?.createObjectURL(file);
};

export function fillMissingDates(
	data: { date: string; ordersCount: number }[],
	from: Date,
	to: Date,
) {
	const days = differenceInDays(to, from) + 1;
	const dateMap = new Map(data.map((d) => [d.date, d.ordersCount]));
	return Array.from({ length: days }).map((_, i) => {
		const date = format(addDays(from, i), "yyyy-MM-dd");
		return {
			date,
			ordersCount: dateMap.get(date) ?? 0,
		};
	});
}

export const generateBarcode = (): string => {
	const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	let result = "";

	for (let i = 0; i < 10; i++) {
		const randomChar = characters.charAt(
			Math.floor(Math.random() * characters.length),
		);
		result += randomChar;
	}

	return result;
};

export const hasChangedData = (a: unknown, b: unknown): boolean =>
	JSON.stringify(a) !== JSON.stringify(b);
