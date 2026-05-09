import { trackPostExBulkOrders } from "./postExServices";
import { CourierData } from "~/types/courier";

export const getBulkCourierTracking = async (
	courierName: string,
	trackingNumbers: string[],
	token: string,
): Promise<Record<string, CourierData>> => {
	if (!trackingNumbers.length && !token) return {};

	switch (courierName.toLowerCase()) {
		case "postex":
			return trackPostExBulkOrders(trackingNumbers, token);
			break;

		// future couriers here
		default:
			return {};
	}
};
