import { Request, Response } from "express";
import { validateWithZod } from "~/utils/errorHandling";
import { getEmployeesSchema } from "~/validations/employee.schema";
import Employee from "~/models/employee";

export const getEmployees = async (req: Request, res: Response): Promise<void> => {
	try {
		const validatedData = await validateWithZod(getEmployeesSchema, req.query);

		const { pageNo, size, q } = validatedData;

		const filter: Record<string, unknown> = {};

		if (q) {
			filter.$or = [
				{ full_name: { $regex: q, $options: "i" } },
				{ phone: { $regex: q, $options: "i" } },
				{ cnic: { $regex: q, $options: "i" } },
				{ designation: { $regex: q, $options: "i" } },
			];
		}

		const totalCount = await Employee.countDocuments(filter);

		const queryOptions = {
			skip: size * (pageNo - 1),
			limit: size,
		};

		const totalPages = Math.ceil(totalCount / size);
		const to = size * pageNo;
		const from = to - (size - 1);

		const employees = await Employee.find(filter, {}, queryOptions).sort({
			createdAt: "desc",
		});

		res.status(200).json({
			total_pages: totalPages,
			total_rows: totalCount,
			from,
			to: to > totalCount ? totalCount : to,
			employees,
		});
	} catch (error) {
		res.status(400).json({ error });
	}
};
