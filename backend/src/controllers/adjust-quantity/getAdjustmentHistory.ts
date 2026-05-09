import { Request, Response } from "express";
import { formatDateTimeToLocaleString } from "~/helper/time-formator";
import ReduceQtyLogs from "~/models/reduce_qty_logs";

export const getAdjustmentHistory = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		const { adjustment_id } = req.query;
		if (!adjustment_id) {
			throw new Error("Adjustment ID is required");
		}

		const adjustmentHistory = await ReduceQtyLogs.find({
			adjustment_id,
		})
			.populate("updated_by", "full_name")
			.sort({ createdAt: "desc" });

		const formattedLogs = adjustmentHistory.map((item?) => {
			const userName = item.updated_by?.full_name ?? "Unknown User";
			const dateTime = formatDateTimeToLocaleString(item?.createdAt) || "N/A";

			return `${Math.abs(
				item?.quantity,
			)} quantities reduced by ${userName} at ${dateTime} due to ${
				item?.reason
			}`;
		});

		res.status(200).json({ adjustment_history: formattedLogs });
	} catch (error) {
		res
			.status(error instanceof Error ? 400 : 500)
			.json({ error: error instanceof Error ? error.message : error });
	}
};
