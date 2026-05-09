export type TValidationError = Error & {
	validation?: Record<string, string>;
	status?: number;
};
