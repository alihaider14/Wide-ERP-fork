import { Request, Response } from "express";
import { validateWithZod } from "~/utils/errorHandling";
import { signInSchema } from "~/validations/auth.schema";
import { ERROR_MESSAGES } from "~/constants/errorMessages";
import {
	getRefreshToken,
	getToken,
	comparePassword,
} from "~/utils/authenticate";
import User from "~/models/user";

export const signin = async (req: Request, res: Response): Promise<void> => {
	try {
		const validatedData = await validateWithZod(signInSchema, req.body);

		const { email, password } = validatedData;

		const user = await User.findOne({ email });

		if (!user) {
			res.status(400).json({ error: ERROR_MESSAGES.signin });
			return;
		}

		const validPassword = await comparePassword(password, user.password);

		if (!validPassword) {
			res.status(400).json({ error: ERROR_MESSAGES.signin });
			return;
		}

		const token = await getToken(user);
		const refreshToken = await getRefreshToken(user);

		res.status(200).json({
			user: {
				_id: user?.id,
				full_name: user?.full_name,
				email: user?.email,
				access: user?.access,
				createdAt: user?.createdAt,
				updatedAt: user?.updatedAt,
			},
			token,
			refreshToken,
		});
	} catch (error) {
		res.status(400).json({ error });
	}
};
