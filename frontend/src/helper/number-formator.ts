export function numberFormateToLocalString(value: number | string) {
	const num = typeof value === "string" ? parseFloat(value) : value;

	if (isNaN(num)) return "0";

	return num.toLocaleString("en-US", {
		maximumFractionDigits: 2,
	});
}

export const calculateDiscount = (
	baseAmount: number,
	discount?: string,
): number => {
	if (!discount) return baseAmount;

	if (discount.includes("%")) {
		const percent = parseFloat(discount.replace("%", ""));
		if (!isNaN(percent)) {
			return baseAmount - (baseAmount * percent) / 100;
		}
	} else {
		const fixed = parseFloat(discount);
		if (!isNaN(fixed)) {
			return baseAmount - fixed;
		}
	}

	return baseAmount;
};

export const calculateProductDiscount = (
	baseAmount: number,
	discount?: string,
): number => {
	if (!discount) return 0;

	// % discount
	if (discount.includes("%")) {
		const percent = parseFloat(discount.replace("%", ""));
		if (!isNaN(percent)) {
			return (baseAmount * percent) / 100;
		}
	}

	// fixed discount
	const fixed = parseFloat(discount);
	if (!isNaN(fixed)) {
		return fixed;
	}

	return 0;
};
