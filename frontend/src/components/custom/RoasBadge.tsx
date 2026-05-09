import { COLOR } from "@/constant/Colors";
import React from "react";

interface RoasBadgeProps {
  show: boolean;
}

const RoasBadge: React.FC<RoasBadgeProps> = ({ show }) => {
  if (!show) return null;

  return (
    <div className="absolute bg-semi-black font-normal text-xs leading-none text-white w-[126px] h-[26px] rounded-[4px] flex items-center justify-center whitespace-nowrap shadow-md z-10 top-1/2 right-full transform -translate-y-1/2 mr-2">
      Expected ROAS ≥ 4
      <div 
        className="absolute top-1/2 left-full transform -translate-y-1/2 rounded-[2px]"
        style={{
          width: "13px",
          height: "14px",
          borderTop: '6px solid transparent',
          borderBottom: '6px solid transparent',
          borderLeft: `6px solid ${COLOR.semiBlack}`
        }}
      />
    </div>
  );
};

export default RoasBadge;