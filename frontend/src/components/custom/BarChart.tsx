import {
	BarChart as RechartsBarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer
} from "recharts";
import React from "react";
import { format, parseISO } from "date-fns";

export type OrdersBarChartData = {
	date: string;
	ordersCount: number;
};

interface BarChartProps {
	data: OrdersBarChartData[];
	height?: number;
	width?: number | string;
	valueLabel?: string;
}

const BarChart: React.FC<BarChartProps> = ({
	data,
	height = 300,
	width = "100%",
	valueLabel = "Value"
}) => {
	// Helper to determine if year should be shown
	const getTickFormatter = () => {
		if (!data || data.length === 0) return () => "";
		return (date: string) => {
			const current = parseISO(date);
			return format(current, "MMM d, yyyy");
		};
	};

	const tickFormatter = getTickFormatter();

	return (
		<div style={{ width, height }}>
			<ResponsiveContainer
				width="100%"
				height="100%"
			>
				<RechartsBarChart
					data={data}
					margin={{ top: 20, right: 30, left: 0, bottom: 60 }}
				>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis
						dataKey="date"
						tick={{ fontSize: 12, dy: 20 }}
						tickFormatter={tickFormatter}
						minTickGap={10}
						angle={-35}
					/>
					<YAxis
						allowDecimals={false}
						tick={{ fontSize: 12 }}
						tickFormatter={(value) =>
							typeof value === "number"
								? value.toLocaleString(undefined, { maximumFractionDigits: 2 })
								: value
						}
					/>
					<Tooltip
						formatter={(value: number | string) => [
							typeof value === "number"
								? value.toLocaleString(undefined, { maximumFractionDigits: 2 })
								: value,
							valueLabel
						]}
						wrapperClassName="bg-white"
					/>
					<Bar
						dataKey="ordersCount"
						fill="#7C3AED"
						barSize={12}
						radius={[8, 8, 0, 0]}
					/>
				</RechartsBarChart>
			</ResponsiveContainer>
		</div>
	);
};

export interface BarChartCardProps extends BarChartProps {
	title: string;
	loading?: boolean;
}

const BarChartCard: React.FC<BarChartCardProps> = ({
	title,
	loading,
	...barChartProps
}) => {
	return (
		<div className="flex-1 flex flex-col gap-3 items-center rounded-sm bg-white py-5 justify-center border border-borderColor relative">
			<div className="absolute top-0 left-0 w-full h-1 rounded-t-sm bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
			<span className="text-lg xl:text-xl font-medium text-semi-black font-poppins mb-2 mt-2">
				{title}
			</span>
			{loading ? (
				<span>Loading chart...</span>
			) : (
				<BarChart {...barChartProps} />
			)}
		</div>
	);
};

export default BarChart;
export { BarChartCard };
