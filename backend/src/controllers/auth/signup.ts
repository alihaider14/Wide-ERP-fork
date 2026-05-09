import { Request, Response } from "express";
import { ERROR_MESSAGES } from "~/constants/errorMessages";
import { validateWithZod } from "~/utils/errorHandling";
import { signUpSchema } from "~/validations/auth.schema";
import {
	generatePassword,
	getRefreshToken,
	getToken,
} from "~/utils/authenticate";
import User from "~/models/user";

export const signup = async (req: Request, res: Response): Promise<void> => {
	try {
		const validatedData = await validateWithZod(signUpSchema, req.body);

		const { full_name, email, password } = validatedData;

		const user = await User.findOne({ email });

		if (user) {
			res.status(400).json({ error: ERROR_MESSAGES.userExists });
			return;
		}

		const hashedPassword = await generatePassword(password);

		const newUser = new User({
			full_name,
			email,
			password: hashedPassword,
		});

		const savedUser = await newUser.save();

		const token = await getToken(savedUser);
		const refreshToken = await getRefreshToken(savedUser);

		res.status(200).json({
			user: {
				_id: savedUser?.id,
				full_name,
				email,
				createdAt: savedUser?.createdAt,
				updatedAt: savedUser?.updatedAt,
			},
			token,
			refreshToken,
		});
	} catch (error) {
		res.status(400).json({ error });
	}
};
