import React from "react";
import {
	ChartHistogram,
  CashApp,
  Truck,
  ReportAnalysis,
} from "@/assets/svg";
import { COLOR } from "@/constant/Colors";

interface SummaryCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, subtitle, icon }) => {
  return (
    <div className="md:min-w-[250px] min-w-full 2xl:w-[303.5px] h-[100px] bg-white border border-borderColor rounded-lg opacity-100 p-6 flex items-center gap-4">
      <div className="bg-editBg h-[48px] w-[48px] flex items-center justify-center rounded-full">
        {icon}
      </div>
      <div className="w-[153px] h-[75px]">
        <p className="font-poppins font-normal text-[14px] leading-none tracking-normal align-middle text-grey h-[21px] flex items-center">{title}</p>
        <p className="font-poppins font-semibold text-[24px] leading-none tracking-normal align-middle h-[36px] flex items-center" style={{ color: COLOR.semiBlack }}>{value}</p>
        {subtitle && (
          <p className="font-poppins font-normal text-[12px] leading-none tracking-normal align-middle text-grey h-[21px] flex items-center">{subtitle}</p>
        )}
      </div>
    </div>
  );
};

interface AnalyticsSummaryProps {
  totalSales: number;
  avgSales: number;
  totalOrders: number;
  avgOrders: number;
  totalSpent: number;
  avgSpent: number;
  totalROAS: number;
  avgROAS: number;
}

const AnalyticsSummary: React.FC<AnalyticsSummaryProps> = ({
  totalSales,
  avgSales,
  totalOrders,
  avgOrders,
  totalSpent,
  avgSpent,
  totalROAS,
  avgROAS,
}) => {
  return (
    <div className="flex flex-wrap gap-[28px] mb-[32px]">
      <SummaryCard
        title="Total Sales"
        value={totalSales.toLocaleString()}
        subtitle={`Avg. ${avgSales.toLocaleString()}`}
        icon={<img src={ChartHistogram} alt="Analytics"  className="h-[32px] w-[32px]"/>}
      />

      <SummaryCard
        title="Total Orders"
        value={totalOrders.toLocaleString()}
        subtitle={`Avg. ${avgOrders.toLocaleString()}`}
        icon={<img src={Truck} alt="Truck"  className="h-[32px] w-[32px]" />}
      />

      <SummaryCard
        title="Total Spent"
        value={totalSpent.toLocaleString()}
        subtitle={`Avg. ${avgSpent.toLocaleString()}`}
        icon={<img src={CashApp} alt="Chart Histogram"  className="h-[32px] w-[32px]" />}
      />

      <SummaryCard
        title="Total ROAS / ROI"
        value={totalROAS.toLocaleString()}
        subtitle={`Avg. ${avgROAS.toLocaleString()}`}
        icon={<img src={ReportAnalysis} alt="Cash App" className="h-[32px] w-[32px]" />}
      />
    </div>
  );
};

export default AnalyticsSummary;