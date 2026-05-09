import React from "react";
import PhoneIndicator from "@/components/custom/phone-indicator";

interface CustomerCellProps {
  customer?: string;
  phone?: string;
  isUnfulfilled: boolean;
  isCancelled?: boolean;
  isHovered: boolean;
  onHoverEnter: () => void;
  onHoverLeave: () => void;
  onEditPhone: () => void;
}

const CustomerCell: React.FC<CustomerCellProps> = ({
  customer,
  phone,
  isUnfulfilled,
  isCancelled,
  isHovered,
  onHoverEnter,
  onHoverLeave,
  onEditPhone,
}) => {
  return (
    <div
      className={`max-w-50 ${isUnfulfilled || isCancelled ? "line-through **:line-through" : ""}`}
      style={{ position: "relative" }}
      onMouseEnter={onHoverEnter}
      onMouseLeave={onHoverLeave}
    >
      {phone ? (
        <PhoneIndicator
          phone={phone}
          label={customer || "N/A"}
          showChevron={isHovered}
          popoverWidth={200}
          onEdit={onEditPhone}
          labelClassName="whitespace-normal break-words"
        />
      ) : (
        <span className="whitespace-normal wrap-break-word">{customer || "N/A"}</span>
      )}
    </div>
  );
};

export default CustomerCell;