import { Response } from "express";
import { validateWithZod } from "~/utils/errorHandling";
import { updateEmployeeSchema } from "~/validations/employee.schema";
import { ERROR_MESSAGES } from "~/constants/errorMessages";
import Employee from "~/models/employee";
import User from "~/models/user";
import { logActivity } from "~/services/activity-logger.service";
import { TAuthenticatedRequest } from "~/types/express";

export const updateEmployee = async (
	req: TAuthenticatedRequest,
	res: Response,
): Promise<void> => {
	try {
		const validatedData = await validateWithZod(updateEmployeeSchema, req.body);

		const { _id, ...updates } = validatedData;

		const employee = await Employee.findById(_id);

		if (!employee) {
			res.status(400).json({ error: ERROR_MESSAGES.employeeNotFound });
			return;
		}

		const updatedData = await Employee.updateOne({ _id }, { $set: updates });

		if (updatedData.modifiedCount > 0) {
			const userId = req.user?._id;
			const updatedName = updates.full_name || employee.full_name;

			if (userId) {
				const user = await User.findById(userId);
				await logActivity({
					type: "update_employee",
					moduleID: String(employee._id),
					activity: `Employee ${updatedName} updated by ${user?.full_name || "User"}.`,
					activistId: userId,
				});
			}

			res.status(200).json({
				employee: { ...employee.toObject(), ...updates },
			});
		} else {
			res.status(400).json({
				message: ERROR_MESSAGES.somethingWentWrong,
			});
		}
	} catch (error) {
		res.status(400).json({ error });
	}
};
