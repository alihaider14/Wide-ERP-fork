import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import type { BillItemsModalProps } from '@/types/bill';
import { XIcon } from 'lucide-react';
import React from 'react';

const BillItemsModal: React.FC<BillItemsModalProps> = ({
  open,
  onClose,
  items,
  loading,
}) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className=' md:max-w-[500px] rounded-none w-full p-0' isCrossIcon={false}>
        <XIcon
          onClick={onClose}
          className='absolute w-6 h-6 cursor-pointer right-2 top-3 z-10 text-grey'
        />
        <div className='overflow-x-auto max-w-[500px]'>
          {loading ? (
            <div className='py-8 text-center'>Loading...</div>
          ) : (
            <table className='w-full text-sm'>
              <thead className='bg-secondary-grey'>
                <tr className='h-[60px] text-[14px] flex justify-evenly items-center'>
                  <th className='text-left py-2 font-medium w-[200px] text-semi-black'>SKU</th>
                  <th className='text-center py-2 font-medium w-[80px] text-semi-black'>Cost × Qty</th>
                  <th className='text-center py-2 font-medium w-[50px] text-semi-black'>Total</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => (
                  <tr key={idx} className='border-b text-[14px] flex justify-evenly items-center'>
                    <td className='w-[200px] h-[60px] flex items-center'>{item.sku}</td>
                    <td className='text-center w-[80px] h-[60px] flex items-center justify-center'>
                      {item.cost} × {item.qty}
                    </td>
                    <td className='w-[50px] text-center h-[60px] flex items-center justify-center'>{item.total_price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BillItemsModal;
