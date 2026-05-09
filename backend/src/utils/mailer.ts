import { hash } from "bcryptjs";
import User from "~/models/user";
import nodemailer from "nodemailer";
import { EmailProps } from "~/types/mailer";

export const sendEmail = async ({ email, emailType, userId }: EmailProps) => {
	try {
		let html, subject;
		if (emailType === "RESET") {
			const hashedToken = await hash(userId, 10);

			await User.updateOne(
				{ _id: userId },
				{
					forgotPasswordToken: hashedToken,
					forgotPasswordTokenExpiry: Date.now() + 3600000
				}
			);
			subject = "Reset your password";
			html = `<p>Click <a href="${process.env.DOMAIN}/reset-password?token=${hashedToken}">here</a> to reset your password
            or copy and paste the link below in your browser. <br>
            ${process.env.DOMAIN}/reset-password?token=${hashedToken}</p>`;

			const transport = nodemailer.createTransport({
				service: "gmail",
				host: "smtp.gmail.com",
				port: 465,
				secure: true,
				auth: {
					 user: process.env.MAILER_USER,
  					 pass: process.env.MAILER_PASS
				}
			});

			const mailOptions = {
				from: "WIDE POS <wdtest.email1@gmail.com>",
				to: email,
				subject,
				html
			};

			const mailresponse = await transport.sendMail(mailOptions);
			return mailresponse;
		}
	} catch (error: unknown | string) {
		throw new Error((error as Error).message);
	}
};
