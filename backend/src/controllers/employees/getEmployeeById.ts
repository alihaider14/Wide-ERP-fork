import { Request, Response } from "express";
import { ERROR_MESSAGES } from "~/constants/errorMessages";
import Employee from "~/models/employee";

export const getEmployeeById = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const employee = await Employee.findById(id);

		if (!employee) {
			res.status(400).json({ message: ERROR_MESSAGES.employeeNotFound });
			return;
		}

		res.status(200).json({
			employee,
		});
	} catch (error) {
		res.status(400).json({ error });
	}
};
