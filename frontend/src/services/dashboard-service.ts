import { TDashboardAnalytics } from "@/types/Dasboard";
import { axiosInstance } from "./axios-cofig";

export const getDashboardAnalytics = async (
	from: Date,
	to: Date
): Promise<TDashboardAnalytics> => {
	const response = await axiosInstance.get(
		`/analytics-over-time?from=${from}&to=${to}`
	);

	return response.data;
};

export const getOrdersOverTime = async (from: Date, to: Date) => {
	const response = await axiosInstance.get(
		`/orders-over-time?from=${from}&to=${to}`
	);
	return response.data.data; // array of { date, ordersCount }
};

export const getSalesOverTime = async (from: Date, to: Date) => {
	const response = await axiosInstance.get(
		`/sales-over-time?from=${from}&to=${to}`
	);
	return response.data.data; // array of { date, sales }
};

export const getTopSellingProducts = async (
	from: Date,
	to: Date,
	limit = 5
) => {
	const response = await axiosInstance.get(
		`/top-selling-products?from=${from}&to=${to}&limit=${limit}`
	);
	return response.data.data;
};
