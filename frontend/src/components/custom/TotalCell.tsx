import React from "react";
import { numberFormateToLocalString } from "@/helper/number-formator";

interface TotalCellProps {
  total?: number | string;
  totalPrice?: number | string;
  items?: number;
  isUnfulfilled: boolean;
  isCancelled?: boolean;
}

const TotalCell: React.FC<TotalCellProps> = ({
  total,
  totalPrice,
  items = 0,
  isUnfulfilled,
  isCancelled,
}) => {
  const raw = total ?? totalPrice ?? "0";
  const num =
    typeof raw === "number"
      ? raw
      : parseFloat(String(raw).replace(/[^0-9.-]+/g, "")) || 0;
  const formatted = numberFormateToLocalString(num);

  return (
    <div className={`inline-flex items-center gap-1 relative ${isUnfulfilled || isCancelled ? "after:content-[''] after:absolute after:left-0 after:right-0 after:top-1/2 after:h-px after:bg-current" : ""}`}>
      <span className="font-poppins font-normal text-[14px] leading-none tracking-normal">
        Rs. {formatted}
      </span>
      <span className="font-poppins font-normal text-[10px] leading-none tracking-normal">
        ({items} {items === 1 ? "item" : "items"})
      </span>
    </div>
  );
};

export default TotalCell;
