import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import CustomCheckbox from "@/components/ui/customCheckboxx";
import RoasBadge from "./RoasBadge";
import { COLOR } from "@/constant/Colors";


export interface AnalyticsData {
  _id: string;
  shop: string;
  sales: number;
  avgSales: number;
  orders: number;
  avgOrders: number;
  spent: number;
  avgSpent: number;
  roas: number;
  balance: number;
  isSelected?: boolean;
}

interface AnalyticsTableRowProps {
  analytics: AnalyticsData;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onToggleSelect: (id: string) => void;
}

const AnalyticsTableRow: React.FC<AnalyticsTableRowProps> = ({
  analytics,
  isHovered,
  onMouseEnter,
  onMouseLeave,
  onToggleSelect,
}) => {
  const [roasHovered, setRoasHovered] = React.useState(false);

  return (
    <TableRow
      key={analytics._id}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`border-b border-border transition-colors ${
        isHovered ? "bg-gray-50 cursor-pointer" : ""
      }`}
    >
      <TableCell className="ps-6 checkbox-cell">
        <CustomCheckbox
          checked={analytics.isSelected || false}
          onChange={() => onToggleSelect(analytics._id)}
        />
      </TableCell>
      
      <TableCell className="font-[500]">
          {analytics.shop}
      </TableCell>
      
      <TableCell className="">
        {analytics.sales.toLocaleString()}
      </TableCell>
      
      <TableCell>
        {analytics.avgSales.toLocaleString()}
      </TableCell>
      
      <TableCell className="text-start">
        {analytics.orders}
      </TableCell>
      
      <TableCell className="text-start">
        {analytics.avgOrders}
      </TableCell>
      
      <TableCell>
        {analytics.spent.toLocaleString()}
      </TableCell>
      
      <TableCell>
        {analytics.avgSpent.toLocaleString()}
      </TableCell>
      
      <TableCell className="">
        <div className="relative">
          <span 
            className={isHovered ? "underline" : ""}
            style={{
              color: isHovered ? COLOR.primaryDarkBlue : "inherit",
              textDecorationColor: isHovered ? COLOR.primaryDarkBlue : "transparent",
              fontWeight: isHovered ? 500 : 400,
            }}
            onMouseEnter={() => setRoasHovered(true)}
            onMouseLeave={() => setRoasHovered(false)}
          >
            {analytics.roas}
          </span>
          
          <RoasBadge show={analytics.roas >= 4 && roasHovered} />
        </div>
      </TableCell>
      
      <TableCell className="">
        {analytics.balance.toLocaleString()}
      </TableCell>
    </TableRow>
  );
};

export default AnalyticsTableRow;