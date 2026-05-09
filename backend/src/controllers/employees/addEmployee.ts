import { Response } from "express";
import User from "~/models/user";
import { logActivity } from "~/services/activity-logger.service";
import { TAuthenticatedRequest } from "~/types/express";
import { validateWithZod } from "~/utils/errorHandling";
import { addEmployeeSchema } from "~/validations/employee.schema";
import { ERROR_MESSAGES } from "~/constants/errorMessages";
import Employee from "~/models/employee";

export const addEmployee = async (
	req: TAuthenticatedRequest,
	res: Response,
): Promise<void> => {
	try {
		const validatedData = await validateWithZod(addEmployeeSchema, req.body);

		const existingEmployee = await Employee.findOne({ cnic: validatedData.cnic });

		if (existingEmployee) {
			res.status(400).json({ error: ERROR_MESSAGES.employeeExists });
			return;
		}

		const newEmployee = new Employee(validatedData);
		const savedEmployee = await newEmployee.save();
		const userId = req.user?._id;

		if (userId) {
			const user = await User.findById(userId);
			await logActivity({
				type: "create_employee",
				moduleID: String(savedEmployee._id),
				activity: `Employee ${savedEmployee.full_name} created by ${user?.full_name || "User"}.`,
				activistId: userId,
			});
		}

		res.status(200).json({ employee: savedEmployee });
	} catch (error) {
		res.status(400).json({ error });
	}
};
