import { CheckIcon } from "lucide-react";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { ChevronDown } from "@/assets/svg";
import { Label } from "../ui/label";

export type TAutocomplete = {
  id: string;
  name: string;
  [key: string]: string | number | boolean | object | undefined;
};

type Props = {
  data?: TAutocomplete[];
  handleSelect?: (item: TAutocomplete) => void;
  placeholder: string;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement> | undefined;
  disabled?: boolean;
  className?: string;
  label?: string;
  dropdownClassName?: string;
  itemClassName?: string;
  onClear?: () => void;
};

type DropdownPos = { top: number; left: number; width: number };

const CustomAutocomplete = ({
  data,
  handleSelect,
  placeholder,
  value,
  onChange,
  disabled,
  className,
  name,
  label,
  dropdownClassName,
  itemClassName,
  onClear,
  required,
  ...props
}: React.ComponentProps<"input"> & Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPos, setDropdownPos] = useState<DropdownPos>({ top: 0, left: 0, width: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<TAutocomplete>();
  const [inputValue, setInputValue] = useState("");
  const isTypingRef = useRef(false);

  const updateDropdownPos = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setDropdownPos({
      top: rect.bottom + window.scrollY + 2,
      left: rect.left + window.scrollX,
      width: rect.width,
    });
  }, []);

  const openDropdown = () => {
    updateDropdownPos();
    setIsOpen(true);
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        if (isTypingRef.current) {
          setInputValue("");
          onClear?.();
        }
        isTypingRef.current = false;
      }
    };

    const handleScroll = () => updateDropdownPos();

    window.addEventListener("click", handleClickOutside);
    window.addEventListener("scroll", handleScroll, true);
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("click", handleClickOutside);
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", handleScroll);
    };
  }, [isOpen, onClear, updateDropdownPos]);

  useEffect(() => {
    if (isTypingRef.current) return;

    if (value) {
      const found = data?.find((item) => item.id === value);
      setSelected(found);
      setInputValue(found?.name || "");
    } else {
      setSelected(undefined);
      setInputValue("");
    }
  }, [value, data]);

  const filteredData = isTypingRef.current
    ? data?.filter((item) =>
        item.name.toLowerCase().includes(inputValue.toLowerCase())
      )
    : data;

  const dropdown = isOpen
    ? createPortal(
        <div
          style={{
            position: "fixed",
            top: dropdownPos.top,
            left: dropdownPos.left,
            width: dropdownPos.width,
            zIndex: 9999,
          }}
          className={cn(
            "max-h-[175px] overflow-y-auto rounded-[8px] border border-background-disabled bg-white p-3 shadow-[0px_16px_32px_-4px_#0C0C0D1A] flex flex-col gap-3",
            dropdownClassName
          )}
        >
          {filteredData && filteredData.length > 0 ? (
            filteredData.map((item, index) => (
              <div
                key={index}
                className={cn(
                  "flex items-center justify-between w-full cursor-pointer hover:bg-neutral-100 px-2 py-1 rounded",
                  itemClassName
                )}
                onMouseDown={(e) => {
                  e.preventDefault();
                }}
                onClick={() => {
                  isTypingRef.current = false;
                  setIsOpen(false);
                  setSelected(item);
                  setInputValue(item.name);
                  handleSelect?.(item);
                }}
              >
                <span className="font-inter font-normal text-sm text-neutral-800">
                  {item.name}
                </span>
                {selected?.id === item.id && <CheckIcon className="size-4" />}
              </div>
            ))
          ) : (
            <span className="font-inter font-normal text-sm text-neutral-800 p-2">
              No options
            </span>
          )}
        </div>,
        document.body
      )
    : null;

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {label && (
        <Label>
          {label} {required && <span className="text-destructive">*</span>}
        </Label>
      )}

      <div ref={containerRef} className="relative">
        <input
          id={name}
          name={name}
          autoComplete="new-autocomplete"
          disabled={disabled}
          value={inputValue}
          onChange={(e) => {
            isTypingRef.current = true;
            setInputValue(e.target.value);
            setSelected(undefined);
            openDropdown();
            onChange?.(e);
          }}
          onFocus={openDropdown}
          placeholder={placeholder}
          required={required}
          className={cn(
            "border-borderColor border file:text-foreground placeholder:text-muted-foreground selection:bg-primary pl-4 selection:text-primary-foreground flex h-9 w-full min-w-0 rounded-[3px] bg-white text-sm text-foreground transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            "focus-visible:border focus-visible:ring-borderColor",
            "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
            className
          )}
          {...props}
        />

        <button
          type="button"
          onClick={() => (isOpen ? setIsOpen(false) : openDropdown())}
          disabled={disabled}
          aria-label="Toggle options"
          className="absolute top-0 bottom-0 end-[11px] cursor-pointer flex items-center justify-center disabled:text-default-70/[.38] text-default-90"
        >
          <img src={ChevronDown} alt="ChevronDown" />
        </button>
      </div>

      {dropdown}
    </div>
  );
};

export default CustomAutocomplete;