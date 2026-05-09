import { Response } from "express";
import { ERROR_MESSAGES } from "~/constants/errorMessages";
import Employee from "~/models/employee";
import User from "~/models/user";
import { logActivity } from "~/services/activity-logger.service";
import { TValidationError } from "~/types/error";
import { TAuthenticatedRequest } from "~/types/express";
import { validateWithZod } from "~/utils/errorHandling";
import { updateEmployeeStatusSchema } from "~/validations/employee.schema";

export const updateEmployeeStatus = async (
	req: TAuthenticatedRequest,
	res: Response,
): Promise<void> => {
	try {
		const validatedData = await validateWithZod(updateEmployeeStatusSchema, req.body);
		const { _id, status } = validatedData;

		const employee = await Employee.findById(_id);

		if (!employee) {
			res.status(400).json({ error: ERROR_MESSAGES.employeeNotFound });
			return;
		}

		const previousStatus = employee.status;

		if (previousStatus === status) {
			res.status(200).json({ employee });
			return;
		}

		employee.status = status;
		await employee.save();

		const userId = req.user?._id;
		if (userId) {
			const user = await User.findById(userId);
			await logActivity({
				type: "update_employee_status",
				moduleID: String(employee._id),
				activity: `${user?.full_name || "User"} changed employee ${employee.full_name}'s status.`,
				activistId: userId,
			});
		}

		res.status(200).json({ employee });
	} catch (error) {
		const parsedError = error as TValidationError;
		res
			.status(parsedError.status ?? 400)
			.json({ error: parsedError.validation ?? parsedError.message });
	}
};
