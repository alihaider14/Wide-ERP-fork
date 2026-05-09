import React from "react";
import DestinationIndicator from "@/components/custom/DestinationIndicator";

interface DestinationCellProps {
  destination: string;
  isUnfulfilled: boolean;
  isCancelled?: boolean;
  isHovered: boolean;
  onHoverEnter: () => void;
  onHoverLeave: () => void;
  onEdit: () => void;
}

const DestinationCell: React.FC<DestinationCellProps> = ({
  destination,
  isUnfulfilled,
  isCancelled,
  isHovered,
  onHoverEnter,
  onHoverLeave,
  onEdit,
}) => {
  return (
    <div
      className={isUnfulfilled || isCancelled ? "line-through [&_*]:line-through" : ""}
      onMouseEnter={onHoverEnter}
      onMouseLeave={onHoverLeave}
      style={{ position: "relative" }}
    >
      <DestinationIndicator
        label={destination}
        destination={destination}
        showChevron={isHovered}
        onEdit={onEdit}
      />
    </div>
  );
};

export default DestinationCell;
