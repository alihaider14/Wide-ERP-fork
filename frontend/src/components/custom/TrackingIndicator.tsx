
"use client";
import * as React from "react";
import { ChevronDownIcon } from "lucide-react";
import { PencilMinusIcon } from "@/assets/svg";

type Props = {
  destination?: string | null;
  className?: string;
  onEdit?: () => void;
  label?: React.ReactNode;
  showChevron?: boolean; 
  popoverWidth?: number;  
};

export default function TrackingIndicator({
  destination,
  className,
  onEdit,
  label,
  showChevron = false,
}: Props) {
  const hasDestination = !!destination?.trim();
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLSpanElement>(null);

  React.useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (open && ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, [open]);

  if (!hasDestination) return null;

   return (
    <span ref={ref} className={["relative inline-flex", className].filter(Boolean).join(" ")}>
      {/* trigger */}
      <button
        type="button"
        className="inline-flex items-center gap-2 cursor-pointer text-left"
        onClick={() => setOpen(o => !o)}
      >
        {label && <span>{label}</span>}
        <ChevronDownIcon
          size={16}
          className={`text-gray-500 transition-opacity duration-150 ${showChevron ? "opacity-100" : "opacity-0"}`}
          aria-hidden={!showChevron}
        />
      </button>

      {open && (
        <div
          className="absolute right-6 z-[60] flex flex-col w-auto min-w-[119px] min-h-0 rounded-[5px] border border-borderColor shadow-[0px_4px_4px_0px_#0000001A] bg-white py-2 px-3"
          onClick={(e) => e.stopPropagation()}
        >
          <p className="text-[13px] leading-5 text-deepBlueBlack whitespace-pre-line break-words">
            {destination}
          </p>

          {onEdit && (
            <button
              type="button"
              className="absolute right-[8px] top-[8px] rounded cursor-pointer flex items-center"
              aria-label="Edit destination"
              onClick={(e) => {
                e.stopPropagation();
                setOpen(false);
                onEdit?.();
              }}
            >
              <img src={PencilMinusIcon} className="w-[20px] h-[20px]" alt="Edit" />
            </button>
          )}
        </div>
      )}
    </span>
  );
}