import { Request, Response } from "express";
import User from "~/models/user";
import { validateWithZod } from "~/utils/errorHandling";
import { sendEmail } from "~/utils/mailer";
import { forgotPasswordSchema } from "~/validations/auth.schema";

export const forgotPassword = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		const validatedData = await validateWithZod(forgotPasswordSchema, req.body);
		const { email } = validatedData;

		const user = await User.findOne({ email });

		if (user) {
			try {
				await sendEmail({
					email,
					emailType: "RESET",
					userId: user._id.toString(),
				});
			} catch (emailError) {
				console.error("Forgot-password email dispatch failed:", {
					email,
					error: (emailError as Error).message,
				});
			}
		}

		res.status(200).json({
			message: "If that email exists, a reset link has been sent.",
		});
	} catch (error) {
		res.status(400).json({ error });
	}
};
