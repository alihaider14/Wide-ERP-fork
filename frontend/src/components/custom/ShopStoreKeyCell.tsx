import React from "react";

interface ShopStoreKeyCellProps {
  storeKey: string;
  isHovered: boolean;
}

const ShopStoreKeyCell: React.FC<ShopStoreKeyCellProps> = ({
  storeKey,
  isHovered,
}) => {
  return (
    <div>
      {isHovered ? (
        <a
          href={`https://${storeKey}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline cursor-pointer transition"
        >
          {storeKey}
        </a>
      ) : (
        <span className="text-black cursor-pointer transition">{storeKey}</span>
      )}
    </div>
  );
};

export default ShopStoreKeyCell;
