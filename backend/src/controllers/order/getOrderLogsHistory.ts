import { Request, Response } from "express";
import { formatDateTimeToLocaleString } from "~/helper/time-formator";
import OrderLogs from "~/models/order_logs";

export const getOrderLogsHistory = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const { order } = req.query;

		if (!order) {
			throw new Error("Order ID is required");
		}

		const orderLogs = await OrderLogs.find({ order_id: order })
			.populate("user_id", "full_name")
			.sort({ createdAt: "desc" });

		const formattedLogs = orderLogs.map((log) => {
			const action = log.is_update ? "updated" : "created";
			const userName =
				log.user_id && "full_name" in log.user_id
					? log.user_id.full_name
					: "Unknown User";
			const dateTime = formatDateTimeToLocaleString(log?.createdAt) || "N/A";
			const discount = log.discount || "0";
			const discountLabel = discount.includes("%")
				? `${discount} %`
				: `${discount} PKR`;

			return `Order ${action} by ${userName} at ${dateTime} with ${log.items_count} items for ${log.amount} PKR after discount ${discountLabel} and status ${log.status}.`;
		});

		res.status(200).json({ order_logs_history: formattedLogs });
	} catch (error) {
		res
			.status(error instanceof Error ? 400 : 500)
			.json({ error: error instanceof Error ? error.message : error });
	}
};
