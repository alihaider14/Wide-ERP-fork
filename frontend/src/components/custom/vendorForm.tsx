import { Input } from '../ui/input';
import { TVendor } from '@/types/Vendor';
import { vendorSchema } from '@/validations/vendor.schema';
import React, { useState } from 'react';
import FormActionButtons from './FormActionButtons';
interface VendorFormProps {
  vendorData: Partial<TVendor>;
  setVendorData: (data: Partial<TVendor>) => void;
  handleChange: (
    setter: (data: Partial<TVendor>) => void
  ) => (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: () => void;
  handleCancel?: () => void;
  isUpdate?: boolean;
}

function VendorForm({
  vendorData,
  setVendorData,
  handleChange,
  handleCancel,
  handleSubmit,
  isUpdate = false,
}: VendorFormProps) {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const dataForValidation = {
      ...vendorData,
      opening_balance:
        vendorData.opening_balance !== undefined &&
        vendorData.opening_balance !== null
          ? String(vendorData.opening_balance)
          : '',
    };
    const result = vendorSchema.safeParse(dataForValidation);
    if (result.success) {
      return {};
    } else {
      const fieldErrors: { [key: string]: string } = {};
      result.error.errors.forEach((err) => {
        if (err.path && err.path.length > 0) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      return fieldErrors;
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (validationErrors.phone) {
      return;
    }
    if (Object.keys(validationErrors).length === 0) {
      handleSubmit();
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <div className='max-w-[1190px] w-auto flex flex-col gap-6 mt-5 bg-white p-10 rounded-[5px] border border-border'>
        <div className='flex gap-[30px]'>
          <div className='w-[540px] h-[58px]'>
            <Input
              label='Full Name'
              placeholder='Full Name'
              name='full_name'
              value={vendorData?.full_name || ''}
              onChange={handleChange(setVendorData)}
              className='pl-4'
            />
            {errors.full_name && (
              <span className='text-red-500 text-xs'>{errors.full_name}</span>
            )}
          </div>
          <div className='w-[540px] h-[58px]'>
            <Input
              label='Email'
              placeholder='Email'
              name='email'
              type='text'
              value={vendorData?.email ?? ''}
              onChange={handleChange(setVendorData)}
              className='pl-4'
            />
            {errors.email && (
              <span className='text-red-500 text-xs'>{errors.email}</span>
            )}
          </div>
        </div>

        <div className='flex gap-[30px]'>
          <div className='w-[540px] h-[58px]'>
            <Input
              label='Phone'
              placeholder='Phone'
              name='phone'
              type='text'
              value={vendorData?.phone || ''}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '').slice(0, 11);
                setVendorData({ ...vendorData, phone: val });
              }}
              className='pl-4'
            />
            {errors.phone && (
              <span className='text-red-500 text-xs'>{errors.phone}</span>
            )}
          </div>
          <div className='w-[540px] h-[58px]'>
            <Input
              label='Opening Balance'
              placeholder='Opening Balance'
              name='opening_balance'
              type='text'
              value={vendorData?.opening_balance ?? ''}
              disabled={isUpdate}
              onChange={(e) => {
                let val = e.target.value.replace(/[^\d.]/g, '');
                const parts = val.split('.');
                if (parts.length > 2) {
                  val = parts[0] + '.' + parts.slice(1).join('');
                }
                const numVal = val === '' ? undefined : Number(val);
                setVendorData({ ...vendorData, opening_balance: numVal });
              }}
              className='pl-4'
            />
            {errors.opening_balance && (
              <span className='text-red-500 text-xs'>
                {errors.opening_balance}
              </span>
            )}
          </div>
        </div>

        <div className='max-w-[1110px] w-auto h-[58px]'>
          <Input
            label='Address'
            placeholder='Address'
            name='address'
            value={vendorData?.address || ''}
            onChange={handleChange(setVendorData)}
            className='pl-4'
          />
        </div>

        <div className='sm:col-span-2 flex justify-end items-center gap-[30px] max-w-[1110px] w-auto h-9'>
          <FormActionButtons onCancel={handleCancel} submitType="submit" />
        </div>
      </div>
    </form>
  );
}

export default VendorForm;
