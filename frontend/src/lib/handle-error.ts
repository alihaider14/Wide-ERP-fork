import Zod, { Schema } from "zod";

export const validateWithZod = async (schema: Schema, data: unknown) => {
	try {
		if (!schema) return;
		const validatedData = await schema.parse(data);
		return validatedData;
	} catch (error: unknown) {
        if(error instanceof Zod.ZodError)
		throw error.issues[0];
	}
};