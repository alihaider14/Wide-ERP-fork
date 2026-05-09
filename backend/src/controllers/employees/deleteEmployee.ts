import { Response } from "express";
import { ERROR_MESSAGES } from "~/constants/errorMessages";
import Employee from "~/models/employee";
import EmployeeSalary from "~/models/employee_salary";
import User from "~/models/user";
import { logActivity } from "~/services/activity-logger.service";
import { TValidationError } from "~/types/error";
import { TAuthenticatedRequest } from "~/types/express";
import { validateWithZod } from "~/utils/errorHandling";
import { deleteEmployeeSchema } from "~/validations/employee.schema";

export const deleteEmployee = async (
	req: TAuthenticatedRequest,
	res: Response,
): Promise<void> => {
	try {
		const validatedData = await validateWithZod(deleteEmployeeSchema, req.body);
		const { _id } = validatedData;

		const employee = await Employee.findById(_id);

		if (!employee) {
			res.status(404).json({ error: ERROR_MESSAGES.employeeNotFound });
			return;
		}

		await EmployeeSalary.deleteMany({ employee_id: employee._id });
		await Employee.findByIdAndDelete(_id);

		const userId = req.user?._id;
		if (userId) {
			const user = await User.findById(userId);
			await logActivity({
				type: "delete_employee",
				moduleID: String(employee._id),
				activity: `${user?.full_name || "User"} deleted employee ${employee.full_name}.`,
				activistId: userId,
			});
		}

		res.status(200).json({
			message: `${employee.full_name} deleted successfully.`,
		});
	} catch (error) {
		const parsedError = error as TValidationError;
		res
			.status(parsedError.status ?? 400)
			.json({ error: parsedError.validation ?? parsedError.message });
	}
};
