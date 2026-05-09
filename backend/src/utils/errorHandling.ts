import Zod, { Schema } from 'zod';

export const validateWithZod = async (schema: Schema, data: unknown) => {
	try {
		if (!schema) return;
		const validatedData = await schema.parse(data);
		return validatedData;
	} catch (error) {
		if (error instanceof Zod.ZodError) {
			const formattedErrors: Record<string, string> = {};
			error.issues.forEach((issue) => {
				const path = issue.path.join('.') || 'body';
				const message = issue.message || 'Invalid value';
				if (!formattedErrors[path]) formattedErrors[path] = message;
			});

			const err = new Error('Validation failed') as Error & {
				status: number;
				validation: Record<string, string>;
			};
			err.status = 400;
			err.validation = formattedErrors;
			throw err;
		}

		throw error;
	}
};
