import { useState, useEffect, useMemo } from "react";
import { useQuery, useQueries } from "@tanstack/react-query";
import { AnalyticsData } from "@/components/custom/AnalyticsTableRow";
import { setStartOfDay, setEndOfDay } from "@/helper/date-format";
import { getShopKeys } from "@/services/shop-service";
import { getShopSalesAnalytics } from "@/services/shopifyorders";
import { DateRange } from "@/components/custom/DatePickerRange";
import { ANALYTICS_BASE_HEAD_DATA } from "@/constant/tableData";
import { buildAnalyticsHead } from "@/helper/table-head";

const useAnalytics = () => {
	const [search, setSearch] = useState("");
	const [hoveredRow, setHoveredRow] = useState<string | null>(null);
	const [selections, setSelections] = useState<Record<string, boolean>>({});
	const today = new Date();
	const [dateRange, setDateRange] = useState<DateRange>({
		from: setStartOfDay(today),
		to: setEndOfDay(today),
	});

	const handleDateRangeChange = (range: { from?: Date; to?: Date }) => {
		setDateRange({ from: range.from, to: range.to });
	};

	const { data: shopList = [], isLoading: isShopsLoading } = useQuery({
		queryKey: ["shop-keys"],
		queryFn: getShopKeys,
	});

	useEffect(() => {
		if (shopList.length > 0 && Object.keys(selections).length === 0) {
			const initial: Record<string, boolean> = {};
			shopList.forEach((s) => {
				if (s._id) initial[s._id] = false;
			});
			setSelections(initial);
		}
	}, [shopList]);

	const allShopIds = shopList.filter((s) => s._id).map((s) => s._id as string);

	const shopNameMap = Object.fromEntries(
		shopList.filter((s) => s._id).map((s) => [s._id, s.name]),
	);

	const startDate = dateRange.from?.toISOString() || "";
	const endDate = dateRange.to?.toISOString() || "";

	const shopQueries = useQueries({
		queries: allShopIds.map((shopId) => ({
			queryKey: ["shopify-sales-analytics", shopId, startDate, endDate],
			queryFn: () => getShopSalesAnalytics(shopId, startDate, endDate),
			enabled: !!startDate && !!endDate,
			retry: false,
		})),
	});

	const isLoading = isShopsLoading || shopQueries.some((q) => q.isLoading);

	const orderedRows = allShopIds.map((shopId, i) => {
		const query = shopQueries[i];
		const shopName = shopNameMap[shopId] || shopId;

		if (query?.data) {
			return {
				_id: query.data.shopId,
				shop: query.data.shop,
				sales: query.data.sales,
				avgSales: query.data.avgSales,
				orders: query.data.orders,
				avgOrders: query.data.avgOrders,
				spent: 0,
				avgSpent: 0,
				roas: 0,
				balance: 0,
				isSelected: selections[shopId] ?? false,
			} as AnalyticsData;
		}

		if (query?.isError) {
			return {
				_id: shopId,
				shop: shopName,
				sales: 0,
				avgSales: 0,
				orders: 0,
				avgOrders: 0,
				spent: 0,
				avgSpent: 0,
				roas: 0,
				balance: 0,
				isSelected: selections[shopId] ?? false,
			} as AnalyticsData;
		}

		return null;
	});

	const loadedRows = orderedRows.filter(
		(item) => item !== null,
	) as AnalyticsData[];
	const selectedData = loadedRows.filter((d) => d.isSelected);

	const summaryData = {
		totalSales: selectedData.reduce((sum, d) => sum + d.sales, 0),
		avgSales: selectedData.reduce((sum, d) => sum + d.avgSales, 0),
		totalOrders: selectedData.reduce((sum, d) => sum + d.orders, 0),
		avgOrders: selectedData.reduce((sum, d) => sum + d.avgOrders, 0),
		totalSpent: 0,
		avgSpent: 0,
		totalROAS: 0,
		avgROAS: 0,
	};

	const handleToggleSelect = (id: string) => {
		setSelections((prev) => ({ ...prev, [id]: !prev[id] }));
	};

	const allRowsSelected =
		loadedRows.length > 0 && loadedRows.every((item) => item.isSelected);
	const someRowsSelected = loadedRows.some((item) => item.isSelected);

	const handleToggleAll = () => {
		const newVal = !allRowsSelected;
		const updated: Record<string, boolean> = { ...selections };
		loadedRows.forEach((item) => {
			updated[item._id] = newVal;
		});
		setSelections(updated);
	};

	const analyticsHead = useMemo(
		() =>
			buildAnalyticsHead(
				allRowsSelected,
				someRowsSelected,
				handleToggleAll,
				ANALYTICS_BASE_HEAD_DATA,
			),
		[allRowsSelected, someRowsSelected, handleToggleAll],
	);

	const colCount = analyticsHead.length;

	return {
		orderedRows,
		allShopIds,
		search,
		hoveredRow,
		summaryData,
		dateRange,
		isLoading,
		setHoveredRow,
		setSearch,
		handleToggleSelect,
		handleDateRangeChange,
		ANALYTICS_HEAD: analyticsHead,
		colCount,
	};
};

export default useAnalytics;
