"use client";
import * as React from "react";
import { ChevronDownIcon } from "lucide-react";
import { COLOR } from "@/constant/Colors";

type Props = {
  phone?: string | null;
  className?: string;
  labelClassName?: string;
  onEdit?: () => void;
  label?: React.ReactNode;
  showChevron?: boolean;
  popoverWidth?: number;
};

export default function PhoneIndicator({
  phone,
  className,
  labelClassName,
  label,
  showChevron = false,
}: Props) {
  const hasPhone = !!phone?.trim();
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

  if (!hasPhone) return null;

  return (
    <span ref={ref} className={["relative inline-flex", className].filter(Boolean).join(" ")}>
      <button
        type="button"
        className="inline-flex items-center gap-2 cursor-pointer text-left"
        onClick={() => setOpen(o => !o)}
      >
        {label && <span className={labelClassName}>{label}</span>}
        <ChevronDownIcon
          size={16}
          className={`text-gray-500 transition-opacity duration-150 min-w-4 ${showChevron ? "opacity-100" : "opacity-0"}`}
          aria-hidden={!showChevron}
        />
      </button>

      {open && (
        <div
          className="absolute right-6 z-[60] flex items-center justify-center"
          style={{
            minWidth: 126,
            width: "auto",
            height: 37,
            borderRadius: 5,
            borderWidth: 1,
            borderStyle: 'solid',
            borderColor: COLOR.borderColor,
            padding: 8,
            gap: 12,
            background: '#fff',
            opacity: 1,
            boxShadow: '0px 4px 4px 0px #0000001A',
            flexDirection: 'column',
            transform: 'rotate(0deg)',
          }}
          onClick={e => e.stopPropagation()}
        >
          <span style={{
            fontSize: 13,
            color: COLOR.deepBlueBlack,
            lineHeight: '18px',
            fontWeight: 500,
            letterSpacing: 0,
            fontFamily: 'Poppins, sans-serif',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>{phone}</span>
        </div>
      )}
    </span>
  );
}