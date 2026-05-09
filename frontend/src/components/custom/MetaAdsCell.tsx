import React from "react";
import { Button } from "@/components/ui/button";

interface MetaAdsCellProps {
  metaAdsManagerId?: string | null;
  isHovered: boolean;
  shopifyStoreKey?: string;
}

const MetaAdsCell: React.FC<MetaAdsCellProps> = ({
  metaAdsManagerId,
  isHovered,
  shopifyStoreKey,
}) => {
  return (
    <div className="w-[120px] text-center">
      {metaAdsManagerId ? (
        isHovered ? (
          <Button
            type="button"
            className="w-[81px] h-[24px] rounded-[3px] border border-primaryDarkBlue bg-blueBg text-primaryDarkBlue font-medium text-[12px] px-[4px] py-[3px] leading-none shadow-none hover:bg-hoverBg focus:outline-none focus:ring-2 focus:ring-primaryDarkBlue focus:ring-offset-0 transition-all duration-150"
            onClick={() => {
              if (shopifyStoreKey) {
                window.open(`https://${shopifyStoreKey}`, "_blank");
              }
            }}
          >
            View
          </Button>
        ) : (
          <span className="inline-flex items-center justify-center w-[81px] h-[24px] rounded border border-green-500 bg-green-50 text-green-500 text-xs font-medium">
            Active
          </span>
        )
      ) : (
        <span className="inline-flex items-center justify-center w-[81px] h-[24px] rounded border border-gray-500 bg-gray-50 text-gray-500 text-xs font-medium">
          Disabled
        </span>
      )}
    </div>
  );
};

export default MetaAdsCell;
