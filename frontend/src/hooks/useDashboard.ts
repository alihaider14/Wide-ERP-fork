import { handleApiError } from "@/helper/error-function";
import { getStartOfToday, getEndOfToday } from "@/helper/date-format";
import {
	getDashboardAnalytics,
	getOrdersOverTime,
	getSalesOverTime,
	getTopSellingProducts
} from "@/services/dashboard-service";
import { TDashboardAnalytics } from "@/types/Dasboard";
import { TError } from "@/types/TError";
import { TDateRange } from "@/types/Date";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const useDashboard = () => {
	const [date, setDate] = useState<TDateRange>({
		from: getStartOfToday(),
		to: getEndOfToday(),
	});

	const { data, error, isLoading, isError } = useQuery<
		TDashboardAnalytics,
		TError
	>({
		queryKey: ["dashboardAnalytics", date?.from, date?.to],
		queryFn: () => getDashboardAnalytics(date.from!, date.to!)
	});

	const { data: ordersOverTimeData = [], isLoading: isOrdersOverTimeLoading } =
		useQuery({
			queryKey: ["ordersOverTime", date?.from, date?.to],
			queryFn: () => getOrdersOverTime(date.from!, date.to!),
			enabled: !!date.from && !!date.to
		});

	const { data: salesOverTimeData = [], isLoading: isSalesOverTimeLoading } =
		useQuery({
			queryKey: ["salesOverTime", date?.from, date?.to],
			queryFn: () => getSalesOverTime(date.from!, date.to!),
			enabled: !!date.from && !!date.to
		});

	const { data: topProducts = [], isLoading: isTopProductsLoading } = useQuery({
		queryKey: ["topSellingProducts", date?.from, date?.to],
		queryFn: () => getTopSellingProducts(date.from!, date.to!),
		enabled: !!date.from && !!date.to
	});

	if (isError)
		handleApiError(error as unknown as TError, "Oops! something went wrong");

	const onDateRangeChange = ({ from, to }: Partial<TDateRange>) => {
		setDate({ from, to });
	};

	return {
		isLoading,
		onDateRangeChange,
		dashboardAnalyticsData: data?.data,
		date,
		ordersOverTimeData,
		isOrdersOverTimeLoading,
		salesOverTimeData,
		isSalesOverTimeLoading,
		topProducts,
		isTopProductsLoading
	};
};
export default useDashboard;
