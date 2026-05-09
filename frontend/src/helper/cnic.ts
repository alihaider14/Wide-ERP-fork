export const formatCNIC = (value: string): string => {
	const digits = value.replace(/\D/g, "").slice(0, 13);
	const first = digits.slice(0, 5);
	const second = digits.slice(5, 12);
	const third = digits.slice(12, 13);

	return [first, second, third].filter(Boolean).join("-");
};
