import * as React from 'react';
import { cn } from '@/lib/utils';
import { Label } from './label';

type DropdownProps = {
  label?: string;
  pad?: boolean;
  containerClassName?: string;
  options: { label: string; value: string }[];
} & React.SelectHTMLAttributes<HTMLSelectElement>;

export function Dropdown({
  className,
  containerClassName,
  label,
  pad,
  options,
  ...props
}: DropdownProps) {
  return (
    <div className={cn('flex flex-col gap-1', containerClassName)}>
      {label && <Label>{label}</Label>}
      <div className="relative w-full">
        <select
          data-slot='dropdown'
          className={cn(
            'border border-borderColor bg-white w-full h-9 min-w-0 rounded-[3px]',
            'font-normal not-italic text-[14px] leading-[1] text-grey',
            'pl-4 pr-9',
            'appearance-none',
            'outline-none focus:outline-none',
            'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
          style={{ verticalAlign: 'middle' }}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="text-grey font-normal text-[14px]">
              {opt.label}
            </option>
          ))}
        </select>
        <span
          className="pointer-events-none absolute right-[11px] top-1/2 -translate-y-1/2 flex items-center h-[14px]"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-grey">
            <path d="M3 5L7 9L11 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </div>
    </div>
  );
}
