import { Request, Response } from "express";
import Employee from "~/models/employee";
import EmployeeSalary from "~/models/employee_salary";
import { ERROR_MESSAGES } from "~/constants/errorMessages";
import { validateWithZod } from "~/utils/errorHandling";
import { getEmployeeSalariesSchema } from "~/validations/employee.schema";

export const getEmployeeSalaries = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		const { id } = req.params;
		const validatedData = await validateWithZod(
			getEmployeeSalariesSchema,
			req.query,
		);
		const { pageNo, size, from, to } = validatedData;

		const employee = await Employee.findById(id);

		if (!employee) {
			res.status(404).json({ error: ERROR_MESSAGES.employeeNotFound });
			return;
		}

		const filter: Record<string, unknown> = {
			employee_id: employee._id,
		};

		if (from || to) {
			const paidAtFilter: Record<string, Date> = {};

			if (from) {
				const fromDate = new Date(from);
				fromDate.setHours(0, 0, 0, 0);
				paidAtFilter.$gte = fromDate;
			}

			if (to) {
				const toDate = new Date(to);
				toDate.setHours(23, 59, 59, 999);
				paidAtFilter.$lte = toDate;
			}

			filter.paid_at = paidAtFilter;
		}

		const totalCount = await EmployeeSalary.countDocuments(filter);
		const totalPages = Math.ceil(totalCount / size);
		const skip = size * (pageNo - 1);
		const salaries = await EmployeeSalary.find(filter)
			.sort({ paid_at: -1, createdAt: -1 })
			.skip(skip)
			.limit(size);

		const toRow = size * pageNo;
		const fromRow = totalCount === 0 ? 0 : toRow - (size - 1);

		res.status(200).json({
			total_pages: totalPages,
			total_rows: totalCount,
			from: fromRow,
			to: toRow > totalCount ? totalCount : toRow,
			salaries,
		});
	} catch (error) {
		res.status(400).json({ error });
	}
};
