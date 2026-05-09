"use client";
import { PencilMinusIcon } from "@/assets/svg";

type Props = {
  note?: string | null;
  className?: string;
  onEdit?: () => void;
};

export default function NoteIndicator({ note, className, onEdit }: Props) {
  if (!note || !note.trim()) return null;

  return (
    <span
      className={["relative inline-flex items-center", className].filter(Boolean).join(" ")}
      aria-label="Order note"
      role="img"
    >
      <div
        className="absolute left-0 top-1/2 -translate-y-1/2 z-[60] hidden group-hover:flex flex-col w-[413px] min-w-[260px] max-w-[420px] h-auto min-h-[42px] rounded-[5px] border border-borderColor shadow-[0px_4px_4px_0px_#0000001A] bg-white py-2 px-3 opacity-100"
      >
        <p className="text-[13px] leading-5 text-deepBlueBlack whitespace-pre-line break-words pr-7">
          {note}
        </p>

            <button
              type="button"
              className="absolute right-[8px] top-[8px] rounded cursor-pointer flex"
              aria-label="Edit note"
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.();
              }}
            >
              <img src={PencilMinusIcon} className="w-[20px] cursor-pointer h-[20px]" alt="WIDE POS" />
            </button>
      </div>
    </span>
  );
}
