import { updateBackgroundTaskStatus } from "@/services/background-tasks.service";
import React, { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import { COLOR } from "@/constant/Colors";

interface TaskStatusSelectProps {
  status: string;
  taskId: string;
  onSuccess: (newStatus: string) => void;
}

const statusStyles: Record<string, { border: string; text: string; background: string }> = {
  Active: { border: COLOR.blue, text: COLOR.blue, background: COLOR.blueBg },
  Paused: { border: COLOR.orange, text: COLOR.orange, background: COLOR.orangeBg },
  Error: { border: COLOR.darkRed, text: COLOR.darkRed, background: COLOR.redBg },
  Completed: { border: COLOR.green, text: COLOR.green, background: COLOR.greenBg },
};

const TaskStatusSelect: React.FC<TaskStatusSelectProps> = ({
  status,
  taskId,
  onSuccess,
}) => {
  const [open, setOpen] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const options: string[] =
    status === "Active" ? ["Pause"] :
    status === "Paused" ? ["Active"] :
    [];

  const handleOpen = () => {
    if (options.length === 0) return;
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
      });
    }
    setOpen(!open);
  };

  const handleSelect = async (option: string) => {
    const newStatus: "Active" | "Paused" = option === "Pause" ? "Paused" : "Active";
    try {
      await updateBackgroundTaskStatus({ id: taskId, status: newStatus });
      onSuccess(newStatus);
      toast.success("Task status updated successfully.");
    } catch {
      toast.error("Failed to update task status.");
    }
    setOpen(false);
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const style = statusStyles[status] ?? { border: COLOR.grey, text: COLOR.grey, background: COLOR.transparent };

  return (
    <div className="relative inline-block text-xs font-medium">
      <button
        ref={buttonRef}
        onClick={handleOpen}
        className="w-25 h-6 px-1 py-0.75 border-[0.5px] rounded-[3px] text-center"
        style={{
          borderColor: style.border,
          color: style.text,
          backgroundColor: style.background,
          cursor: options.length > 0 ? "pointer" : "default",
        }}
      >
        {status}
      </button>

      {open && options.length > 0 && (
        <div
          ref={dropdownRef}
          className="fixed w-28 bg-white border rounded-[3px] shadow-lg z-9999"
          style={{
            top: dropdownPos.top,
            left: dropdownPos.left,
          }}
        >
          {options.map((option, index) => (
            <div
              key={option}
              onClick={() => handleSelect(option)}
              className={`
                font-normal
                pr-2 pl-4 py-3
                text-left
                text-deepNavy
                hover:bg-gray-100
                cursor-pointer
                ${index !== options.length - 1 ? "border-b border-gray-200" : ""}
              `}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskStatusSelect;