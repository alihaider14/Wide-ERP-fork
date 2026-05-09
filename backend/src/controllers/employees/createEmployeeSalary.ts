import { Response } from "express";
import Employee from "~/models/employee";
import EmployeeSalary from "~/models/employee_salary";
import User from "~/models/user";
import { ERROR_MESSAGES } from "~/constants/errorMessages";
import { logActivity } from "~/services/activity-logger.service";
import { TAuthenticatedRequest } from "~/types/express";
import { validateWithZod } from "~/utils/errorHandling";
import { createEmployeeSalarySchema } from "~/validations/employee.schema";

export const createEmployeeSalary = async (
	req: TAuthenticatedRequest,
	res: Response,
): Promise<void> => {
	try {
		const validatedData = await validateWithZod(
			createEmployeeSalarySchema,
			req.body,
		);
		const { employee_id, paid_at, ...salaryData } = validatedData;

		const employee = await Employee.findById(employee_id);

		if (!employee) {
			res.status(404).json({ error: ERROR_MESSAGES.employeeNotFound });
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

		const employeeSalary = await EmployeeSalary.create({
			employee_id: employee._id,
			...salaryData,
			paid_at: normalizedPaidAt,
		});

		const totalAmount =
			(salaryData.base_salary || 0) +
			(salaryData.commission || 0) +
			(salaryData.other || 0);

		await Employee.findByIdAndUpdate(employee_id, {
			last_paid: normalizedPaidAt,
			last_payment_amount: totalAmount,
		});

		const userId = req.user?._id;

		if (userId) {
			const user = await User.findById(userId);
			await logActivity({
				type: "update_employee",
				moduleID: String(employee._id),
				activity: `${user?.full_name || "User"} paid salary to employee ${employee.full_name}.`,
				activistId: userId,
			});
		}

		res.status(201).json({
			salary: employeeSalary,
		});
	} catch (error) {
		res.status(400).json({ error });
	}
};
