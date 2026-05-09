import { Search } from '@/assets/svg';
import React, { useCallback, useEffect, useRef } from 'react';
import { Input } from '../ui/input';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { COLOR } from '@/constant/Colors';

type TProps = {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  placeholder?: string;
  isFocusButtons?: boolean;
  onNextPage?: () => void;
  onPrevPage?: () => void;
  inputClassName?: string;
};

const SearchInput = ({
  onChange,
  value,
  className,
  placeholder,
  isFocusButtons,
  onNextPage,
  onPrevPage,
  inputClassName,
  ...props
}: React.ComponentProps<'input'> & TProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.ctrlKey && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      inputRef.current?.focus();
      return;
    }

    const tag = (event.target as HTMLElement)?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

    if (event.key.toLowerCase() === 'k' && onNextPage) {
      event.preventDefault();
      onNextPage();
    } else if (event.key.toLowerCase() === 'j' && onPrevPage) {
      event.preventDefault();
      onPrevPage();
    }
  }, [onNextPage, onPrevPage]);

  useEffect(() => {
      window.addEventListener('keydown', handleKeyDown);

      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
  }, [handleKeyDown]);

  const focusSearchInput = () => {
    inputRef.current?.focus();
  };

  return (
    <div className={cn('relative', className)}>
      <img
        src={Search}
        alt='search'
        className='absolute left-[16px] top-1/2 size-6 -translate-y-1/2 '
      />
      <Input
        ref={inputRef}
        placeholder={placeholder}
        value={value || ''}
        onChange={onChange}
        onFocus={(e) => (e.target.style.boxShadow = 'none')}
        className={cn(`${isFocusButtons && 'pr-32'} ps-12 text-ellipsis`, inputClassName)}
        {...props}
        pad
      />

      {isFocusButtons && (
        <div className='flex flex-row gap-3 items-center absolute right-4 top-1/2  -translate-y-1/2 '>
          <Button
            variant='ghostSecondary'
            className='font-normal text-xs max-h-6 w-10! px-0 py-0 bg-borderColor text-black border border-borderColor shadow-none'
            style={{
              background: COLOR.borderColor,
              color: '#000',
              border: `0.5px solid ${COLOR.borderColor}`,
              boxShadow: 'none',
            }}
            onClick={focusSearchInput}
          >
            Ctrl
          </Button>
          <Button
            variant='ghostSecondary'
            className='font-normal text-xs size-6! px-0 py-0 bg-borderColor text-black border border-borderColor shadow-none'
            style={{
              background: COLOR.borderColor,
              color: '#000',
              border: `0.5px solid ${COLOR.borderColor}`,
              boxShadow: 'none',
            }}
            onClick={focusSearchInput}
          >
            K
          </Button>
        </div>
      )}
    </div>
  );
};

export default SearchInput;
