export type TError = TFieldErrors & {
	response: {
		status: number;
		data: {
			message: string;
			details: Record<string, string[]>;
			error: string;
		};
	};
};

export type TFieldErrors = Record<string, string>;
