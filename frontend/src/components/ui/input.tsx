import * as React from 'react';

import { cn } from '@/lib/utils';
import { Label } from './label';

type InputProps = {
	label?: string;
	pad?: boolean;
	containerClassName?: string;
	required?: boolean;
};

function Input({
  className,
  containerClassName,
  type,
  label,
  pad,
  required,
  ...props
}: React.ComponentProps<'input'> & InputProps) {
  return (
    <div className={cn('flex flex-col gap-1', containerClassName)}>
      {label && (
        <Label>
          {label} {required && <span className="text-destructive">*</span>}
        </Label>
      )}
      <input
        type={type}
        data-slot='input'
        className={cn(
          'border border-borderColor shadow-none file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex h-9 w-full min-w-0 rounded-[3px] bg-white text-sm text-foreground transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
          'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
          pad ? 'py-[7.5px] px-[46px]' : 'py-[7.5px] px-[20px]',
          className
        )}
        {...props}
      />
    </div>
  );
}

export { Input };
