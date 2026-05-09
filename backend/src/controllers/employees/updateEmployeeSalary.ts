import { Response } from "express";
import EmployeeSalary from "~/models/employee_salary";
import Employee from "~/models/employee";
import User from "~/models/user";
import { ERROR_MESSAGES } from "~/constants/errorMessages";
import { logActivity } from "~/services/activity-logger.service";
import { TAuthenticatedRequest } from "~/types/express";
import { validateWithZod } from "~/utils/errorHandling";
import { updateEmployeeSalarySchema } from "~/validations/employee.schema";

export const updateEmployeeSalary = async (
	req: TAuthenticatedRequest,
	res: Response,
): Promise<void> => {
	try {
		const validatedData = await validateWithZod(
			updateEmployeeSalarySchema,
			req.body,
		);
		const { _id, paid_at, ...salaryData } = validatedData;

		const salary = await EmployeeSalary.findById(_id);

		if (!salary) {
			res.status(404).json({ error: "Salary record not found." });
			return;
		}

		const parsedPaidAt = new Date(paid_at);

		if (Number.isNaN(parsedPaidAt.getTime())) {
			res.status(400).json({ error: ERROR_MESSAGES.paidAtRequired });
			return;
		}

		const normalizedPaidAt = new Date(
			Date.UTC(
				parsedPaidAt.getUTCFullYear(),
				parsedPaidAt.getUTCMonth(),
				parsedPaidAt.getUTCDate(),
			),
		);

		const updatedSalary = await EmployeeSalary.findByIdAndUpdate(
			_id,
			{
				...salaryData,
				paid_at: normalizedPaidAt,
			},
			{ new: true },
		);

		const latestSalary = await EmployeeSalary.findOne({
			employee_id: salary.employee_id,
		}).sort({ paid_at: -1 });

		if (latestSalary) {
			const totalAmount =
				(latestSalary.base_salary || 0) +
				(latestSalary.commission || 0) +
				(latestSalary.other || 0);

			await Employee.findByIdAndUpdate(salary.employee_id, {
				last_paid: latestSalary.paid_at,
				last_payment_amount: totalAmount,
			});
		}

		const employee = await Employee.findById(salary.employee_id);
		const userId = req.user?._id;

		if (userId) {
			const user = await User.findById(userId);
			await logActivity({
				type: "update_employee",
				moduleID: String(salary.employee_id),
				activity: `${user?.full_name || "User"} updated salary record for employee ${employee?.full_name || "Unknown"}.`,
				activistId: userId,
			});
		}

		res.status(200).json({
			salary: updatedSalary,
		});
	} catch (error) {
		res.status(400).json({ error });
	}
};
