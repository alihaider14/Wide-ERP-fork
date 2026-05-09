'use client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useEffect, useState } from 'react';

type Props = {
  open: boolean;
  orderNo: string;
  customer: string;
  initialValue?: string;
  kind?: 'note' | 'phone';
  onClose: () => void;
  onSave: (value: string) => void;
};

export default function AddNoteModal({
  open,
  orderNo,
  customer,
  initialValue,
  kind = 'note',
  onClose,
  onSave,
}: Props) {
  const [value, setValue] = useState('');

  useEffect(() => {
    if (open) {
      setValue(initialValue ?? '');
    } else {
      setValue('');
    }
  }, [open, initialValue]);

  const isPhone = kind === 'phone';
  const cta = isPhone
    ? 'Update Phone'
    : initialValue?.trim()
      ? 'Update Note'
      : 'Add Note';

  const placeholder = isPhone ? 'Enter phone number' : 'Write here';

  return (
    <Dialog open={open} onOpenChange={(o) => (!o ? onClose() : null)}>
      <DialogContent className='w-[450px] h-max rounded-[5px] bg-white overflow-hidden p-5'>
        <div className='grid grid-cols-[auto_1fr_auto] items-center mb-3 w-full'>
          <span className='text-sm font-semibold'>{orderNo}</span>
          <span className='text-sm font-medium text-center pl-2 pr-10'>{customer}</span>
          <span />
        </div>

        <div>
          <textarea
            rows={6}
            className='w-[410px] h-[156px] rounded-[5px] border border-borderColor bg-white text-[14px] p-3 resize-none focus:outline-none'
            placeholder={placeholder}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <div className='mt-3 flex justify-end'>
            <Button
              className='h-9 px-4 min-w-[140px] whitespace-nowrap rounded-[3px] bg-primaryDarkBlue font-poppins font-medium text-[14px] text-white border-none shadow-none cursor-pointer'
              onClick={() => {
                const v = value.trim();
                if (!v) return;
                onSave(v);
                onClose();
              }}
            >
              {cta}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
