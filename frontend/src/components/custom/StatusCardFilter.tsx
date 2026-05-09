import React from "react";

interface StatusCard {
  label: string;
  value: string;
}

interface StatusCardFilterProps {
  statusCards: StatusCard[];
  activeStatus: string;
  onStatusChange: (status: string) => void;
}

const StatusCardFilter: React.FC<StatusCardFilterProps> = ({
  statusCards,
  activeStatus,
  onStatusChange,
}) => {
  return (
    <div className="flex rounded-[3px] border border-solid opacity-100 py-1.25 px-1.5 relative min-h-12.5 h-auto flex-wrap items-center bg-white gap-3">
      {statusCards.map((card) => (
        <button
          key={card.label}
          className={`font-poppins font-medium text-[12px] leading-[100%] align-middle rounded-[3px] transition-colors cursor-pointer text-center p-3 h-10.5 border-none not-italic tracking-[0] opacity-100 ${
            activeStatus === card.value
              ? "bg-blue text-white"
              : "bg-white text-semi-black"
          }`}
          onClick={() => onStatusChange(card.value)}
        >
          {card.label}
        </button>
      ))}
    </div>
  );
};

export default StatusCardFilter;
