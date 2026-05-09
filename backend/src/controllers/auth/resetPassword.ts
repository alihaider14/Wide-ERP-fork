import { genSalt, hash } from "bcryptjs";
import { Request, Response } from "express";
import { ERROR_MESSAGES } from "~/constants/errorMessages";
import User from "~/models/user";
import { validateWithZod } from "~/utils/errorHandling";
import { resetPasswordSchema } from "~/validations/auth.schema";

export const resetPassword = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		const validatedData = await validateWithZod(resetPasswordSchema, req.body);
		const { token, newPassword, confirmPassword } = validatedData;

		const user = await User.findOne({
			forgotPasswordToken: token,
			forgotPasswordTokenExpiry: { $gt: Date.now() },
		});

		if (!user) {
			res.status(400).json({ error: ERROR_MESSAGES.invalidToken });
			return;
		}

		if (newPassword !== confirmPassword) {
			res.status(400).json({ error: ERROR_MESSAGES.passwordNotMatch });
			return;
		}

		const salt = await genSalt(10);
		const hashedPassword = await hash(newPassword, salt);

		user.password = hashedPassword;
		user.forgotPasswordToken = undefined;
		user.forgotPasswordTokenExpiry = undefined;
		await user.save();

		res.status(200).json({
			user: {
				_id: user.id,
				full_name: user.full_name,
				email: user.email,
			},
		});
	} catch (error) {
		res.status(400).json({ error });
	}
};
