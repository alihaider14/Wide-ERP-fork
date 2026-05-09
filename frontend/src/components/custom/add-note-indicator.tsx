"use client";
import { MessagePlus } from "@/assets/svg";

export default function AddNoteIndicator({
  active,
  className,
}: { active: boolean; className?: string }) {
  if (!active) return null; 
  return (
    <span
      className={["inline-flex items-center", className].filter(Boolean).join(" ")}
      aria-hidden="true"          
    >
    
      <img src={MessagePlus} className="w-[20px] cursor-pointer h-[20px]" alt="WIDE POS" />
    </span>
  );
}
