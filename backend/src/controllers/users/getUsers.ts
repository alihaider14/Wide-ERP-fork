import { Request, Response } from "express";
import { validateWithZod } from "~/utils/errorHandling";
import { getUsersSchema } from "~/validations/user.schema";
import User from "~/models/user";

export const getUsers = async (req: Request, res: Response): Promise<void> => {
	try {
		const validatedData = await validateWithZod(getUsersSchema, req.query);

		const { pageNo, size, q } = validatedData;

		const filter: {
			$or?: Array<
				| { full_name: { $regex: string; $options: string } }
				| { email: { $regex: string; $options: string } }
				| { phone: { $regex: string; $options: string } }
				| { user_id: number }
			>;
		} = {};

		if (q) {
			filter.$or = [
				{ full_name: { $regex: q, $options: "i" } },
				{ email: { $regex: q, $options: "i" } },
				{ phone: { $regex: q, $options: "i" } },
			];
			const numericQuery = Number(q);
			if (!isNaN(numericQuery)) {
				filter.$or.push({ user_id: numericQuery });
			}
		}

		const totalCount = await User.countDocuments(filter);

		const queryOptions = {
			skip: size * (pageNo - 1),
			limit: size,
		};

		const totalPages = Math.ceil(totalCount / size);
		const to = size * pageNo;
		const from = to - (size - 1);

		const users = await User.find(filter, {}, queryOptions).sort({
			createdAt: "desc",
		});

		res.status(200).json({
			total_pages: totalPages,
			total_rows: totalCount,
			from,
			to: to > totalCount ? totalCount : to,
			users,
		});
	} catch (error) {
		res.status(400).json({ error });
	}
};
