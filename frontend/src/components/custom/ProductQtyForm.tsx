import React from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { TAdjustQty } from '@/types/AdjustQty';

type TProps = {
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  data?: Partial<TAdjustQty>;
  handleSumbit?: () => void;
  handleCancel?: () => void;
  isLoading?: boolean;
  isDisabled?: boolean;
};

const ProductQtyForm = ({
  onChange,
  data,
  handleCancel,
  handleSumbit,
  isLoading,
  isDisabled,
}: TProps) => {
  return (
    <div className='w-full bg-white border border-border rounded-[5px] max-w-[810px] p-5 sm:p-10 grid md:grid-cols-2 gap-5 sm:gap-10'>
      <Input
        placeholder='Cost'
        label='Cost'
        name='cost'
        onChange={onChange}
        value={data?.cost || ''}
        type='number'
        disabled={isDisabled}
        min={1}
      />

      <Input
        placeholder='Quantity'
        name='quantity'
        label='Quantity'
        onChange={onChange}
        value={data?.quantity || ''}
        type='number'
        disabled={isDisabled}
        min={1}
      />

      <Input
        placeholder='Reason to adjust the quantity'
        name='reason'
        label='Reason'
        onChange={onChange}
        value={data?.reason || ''}
        containerClassName='md:col-span-2'
        className='custom-input focus:shadow-none'
      />

      <Button onClick={handleSumbit} disabled={isLoading}>
        Submit
      </Button>
      <Button variant='secondary' onClick={handleCancel}>
        Cancel
      </Button>
    </div>
  );
};

export default ProductQtyForm;
