import { z } from 'zod';
export const vendorSchema = z.object({
  full_name: z
    .string({ required_error: 'Vendor name is required' })
    .trim()
    .min(1, { message: 'Vendor name cannot be empty' })
    .max(255, { message: 'Vendor name must not exceed 255 characters' })
    .regex(/^[a-zA-Z ]+$/, { message: 'Name can only contain letters and spaces' }),

  email: z
    .string()
    .trim()
    .optional()
    .or(z.literal(''))
    .or(z.null())
    .refine(
      (val) => {
        if (!val || val === '') return true;
        return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(val);
      },
      { message: 'Please provide a valid email address' }
    ),

  phone: z
    .string({ required_error: 'Phone number is required' })
    .trim()
    .regex(/^\d+$/, { message: '' })
    .refine((val) => val.length === 11, {
      message: 'Invalid phone number',
    }),

  address: z
    .string()
    .trim()
    .max(255, { message: 'Address must not exceed 255 characters' })
    .optional()
    .default(''),

  opening_balance: z
    .string({ required_error: 'Opening Balance is required' })
    .refine(
      (val) => {
        if (val === '') return true;
        if (!/^(\d+)(\.\d{1,2})?$/.test(val)) return false;
        return Number(val) >= 0;
      },
      {
        message: 'Opening Balance must be a valid number',
      }
    )
    .optional()
    .default(''),
});

export type VendorFormType = z.infer<typeof vendorSchema>;
