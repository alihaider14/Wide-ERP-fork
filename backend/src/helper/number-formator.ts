export function formatPrice(value: number | string): string {
	const num = typeof value === "string" ? parseFloat(value) : value;

	if (isNaN(num)) return "0";

	return num.toLocaleString("en-US", {
		maximumFractionDigits: 2,
	});
}

export const parseDiscountAmount = (
	discount: string,
	subtotal: number,
): number => {
	const trimmed = discount.trim();
	if (trimmed.endsWith("%")) {
		const pct = parseFloat(trimmed);
		return isNaN(pct) ? 0 : toCurrency((pct / 100) * subtotal);
	}
	const flat = parseFloat(trimmed);
	return isNaN(flat) ? 0 : flat;
};

export const toCurrency = (n: number): number => Math.round(n * 100) / 100;
