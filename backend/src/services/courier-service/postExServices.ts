import axios from "axios";
import { CourierData } from "~/types/courier";
import { BulkTrackingResponse, GetMerchanAdress } from "~/types/postEx-courier";

const POSTEX_BASE_URL =
	"https://api.postex.pk/services/integration/api/order/v1";

const getPostexMerchantAddress = async (
	token: string,
	cityName?: string,
): Promise<GetMerchanAdress | null> => {
	const res = await axios.get(`${POSTEX_BASE_URL}/get-merchant-address`, {
		headers: { token },
		params: cityName ? { cityName } : undefined,
	});

	const list: GetMerchanAdress[] = res.data?.dist ?? [];

	if (!list.length) return null;

	const pickup = list.find((a) => a.addressType === "Pickup/Return Address");

	if (!pickup) return null;

	return pickup;
};

export const trackPostExBulkOrders = async (
	trackingNumbers: string[],
	token: string,
): Promise<Record<string, CourierData>> => {
	const [trackingRes, merchantInfo] = await Promise.all([
		axios.get(`${POSTEX_BASE_URL}/track-bulk-order`, {
			headers: { token },
			params: {
				TrackingNumbers: trackingNumbers.join(","),
			},
		}),
		getPostexMerchantAddress(token),
	]);

	const map: Record<string, CourierData> = {};

	for (const item of trackingRes.data?.dist ?? []) {
		const t = item.trackingResponse as BulkTrackingResponse;

		if (!t?.trackingNumber) continue;

		map[t.trackingNumber] = {
			trackingNumber: t.trackingNumber,
			cityName: merchantInfo?.cityName || "",
			contact: merchantInfo?.phone1 || merchantInfo?.phone2 || "",
			pickupAdress: t.pickupAddress ?? "",
			returnAdress: t?.returnAddress ?? "",
			details: t.orderDetail ?? "",
			name: t.merchantName ?? "",
			orderRefNumber: t.orderRefNumber ?? "",
			remarks: t?.transactionNotes ?? "",
			customerName: t?.customerName ?? "",
			customerPhone: t?.customerPhone ?? "",
			deliveryAddress: t?.deliveryAddress ?? "",
			destination: t?.cityName || "",
		};
	}

	return map;
};
