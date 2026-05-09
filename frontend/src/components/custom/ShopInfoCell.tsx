import React from "react";
import { ShopifyTables } from "@/assets/svg";

interface ShopInfoCellProps {
  name: string;
  logoUrl?: string;
}

const ShopInfoCell: React.FC<ShopInfoCellProps> = ({ name, logoUrl }) => {
  return (
    <div className="flex items-center gap-2">
      <img
        src={logoUrl ? logoUrl : ShopifyTables}
        alt={name}
        className="w-10 h-10 rounded-lg"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src = ShopifyTables;
        }}
      />
      <span className="font-normal ps-2 text-[14px] text-semi-black">
        {name}
      </span>
    </div>
  );
};

export default ShopInfoCell;
