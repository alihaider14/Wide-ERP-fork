import { Request, Response } from "express";
import { ERROR_MESSAGES } from "~/constants/errorMessages";
import User from "~/models/user";

export const deleteUserById = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const user = await User.findById(id);

		if (!user) {
			res.status(400).json({ message: ERROR_MESSAGES.user });
			return;
		}

		const DeletedUser = await User.findByIdAndDelete(id);

		res.status(200).json({
			user: DeletedUser,
		});
	} catch (error) {
		res.status(400).json({ error });
	}
};
