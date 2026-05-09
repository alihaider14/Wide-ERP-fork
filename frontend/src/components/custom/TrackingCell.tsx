import React from "react";
import TrackingIndicator from "@/components/custom/TrackingIndicator";

interface TrackingCellProps {
  trackingReference?: string;
  tracking?: string;
  isUnfulfilled: boolean;
  isCancelled?: boolean;
  isHovered: boolean;
}

const TrackingCell: React.FC<TrackingCellProps> = ({
  trackingReference,
  tracking,
  isUnfulfilled,
  isCancelled,
  isHovered,
}) => {
  return (
    <div className={isUnfulfilled || isCancelled ? "line-through" : undefined}>
      {trackingReference?.includes("Delivered") ? (
        <span className="px-3 py-1 rounded text-[12px] font-[500] bg-green-50 text-green-500 border border-green-500">
          Delivered
        </span>
      ) : (
        <TrackingIndicator
          label={trackingReference ?? ""}
          destination={tracking ?? ""}
          showChevron={isHovered}
          popoverWidth={119}
        />
      )}
    </div>
  );
};

export default TrackingCell;
