import { Request, Response } from "express";
import { validateWithZod } from "~/utils/errorHandling";
import { addUserSchema } from "~/validations/user.schema";
import { ERROR_MESSAGES } from "~/constants/errorMessages";
import User from "~/models/user";
import Counter from "~/models/counter";
import { generatePassword } from "~/utils/authenticate";

export const addUser = async (req: Request, res: Response): Promise<void> => {
	try {
		const validatedData = await validateWithZod(addUserSchema, req.body);
		const { full_name, email, phone, designation, password, access } =
			validatedData;

		const user = await User.findOne({
			email,
		});

		if (user) {
			res.status(400).json({ error: ERROR_MESSAGES.userExists });
			return;
		}

		const counter = await Counter.findByIdAndUpdate(
			{ _id: "user_id" },
			{ $inc: { sequence_value: 1 } },
			{ new: true, upsert: true },
		);

		const hashedPassword = await generatePassword(password);

		const newUser = new User({
			user_id: counter.sequence_value,
			full_name,
			email,
			phone,
			designation,
			password: hashedPassword,
			access,
		});

		const savedUser = await newUser.save();

		res.status(200).json({
			user: {
				_id: savedUser.id,
				user_id: savedUser.user_id,
				full_name: savedUser.full_name,
				email: savedUser.email,
				phone: savedUser.phone,
				designation: savedUser.designation,
				access: savedUser.access,
				createdAt: savedUser.createdAt,
			},
		});
	} catch (error) {
		res.status(400).json({ error });
	}
};
