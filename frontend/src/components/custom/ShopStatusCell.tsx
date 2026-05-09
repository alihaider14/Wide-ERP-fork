import React from "react";

interface ShopStatusCellProps {
  status: string;
}

const ShopStatusCell: React.FC<ShopStatusCellProps> = ({ status }) => {
  return (
    <div>
      {status === "Active" ? (
        <span className="inline-flex items-center justify-center w-[81px] h-[24px] rounded border border-green-500 bg-green-50 text-green-500 text-xs font-medium">
          Active
        </span>
      ) : (
        <span className="inline-flex items-center justify-center w-[81px] h-[24px] rounded border border-gray-500 bg-gray-50 text-gray-500 text-xs font-medium">
          Disabled
        </span>
      )}
    </div>
  );
};

export default ShopStatusCell;
