import { CustomLoader, Layout, PageHeader } from "@/components";
import DashboardCard from "@/components/custom/DashboardCard";
import { DateRangePicker } from "@/components/custom/DatePickerRange";
import { numberFormateToLocalString } from "@/helper/number-formator";
import useDashboard from "@/hooks/useDashboard";
import { BarChartCard } from "@/components/custom/BarChart";
import { fillMissingDates } from "@/lib/utils";
import TopSellingProductsCard from "@/components/custom/TopSellingProductsCard";

const Dashboard = () => {
	const {
		onDateRangeChange,
		isLoading,
		dashboardAnalyticsData,
		date,
		ordersOverTimeData,
		isOrdersOverTimeLoading,
		salesOverTimeData,
		isSalesOverTimeLoading,
		topProducts,
		isTopProductsLoading
	} = useDashboard();
	return (
		<Layout>
			<CustomLoader isLoading={isLoading} />
			<PageHeader heading="Dashboard" />
			<DateRangePicker
				initialValue={date}
				onDateRangeChange={onDateRangeChange}
			/>
			<div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-6 mt-5">
				{dashboardAnalyticsData?.map((item, index) => (
					<DashboardCard
						label={item.label}
						value={numberFormateToLocalString(item.value)}
						key={index}
					/>
				))}
			</div>

			{/* Responsive flex container for charts */}
			<div className="flex flex-col lg:flex-row gap-5 mt-5 w-full">
				<BarChartCard
					title="Sales Over Time"
					loading={isSalesOverTimeLoading}
					data={fillMissingDates(
						salesOverTimeData.map((item: { date: string; sales: number }) => ({
							date: item.date,
							ordersCount: item.sales
						})),
						date.from!,
						date.to!
					)}
					height={300}
					valueLabel="Sales"
				/>
				<BarChartCard
					title="Orders Over Time"
					loading={isOrdersOverTimeLoading}
					data={fillMissingDates(ordersOverTimeData, date.from!, date.to!)}
					height={300}
					valueLabel="Orders"
				/>
			</div>

			<TopSellingProductsCard
				topProducts={topProducts}
				isLoading={isTopProductsLoading}
			/>
		</Layout>
	);
};

export default Dashboard;
