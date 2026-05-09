import { handleApiError } from '@/helper/error-function';
import { VendorService } from '@/services';
import { TVendor } from '@/types/Vendor';
import { TError } from '@/types/TError';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const useAddVendor = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [vendorData, setVendorData] = useState<Partial<TVendor>>({
    full_name: '',
    email: '',
    phone: '',
    address: '',
  });

  const handleChange =
    (setter: React.Dispatch<React.SetStateAction<Partial<TVendor>>>) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target;
      setter((prev) => ({
        ...prev,
        [name]: name === 'opening_balance' ? Number(value) : value,
      }));
    };

  const addVendorMutation = useMutation({
    mutationFn: VendorService.addVendor,
    onSuccess: handleAddVendorSuccess,
    onError: handleAddVendorError,
  });

  const handleAddVendor = (vendorData: Partial<TVendor>) => {
    if (vendorData?.full_name && vendorData?.phone) {
      setLoading(true);
      addVendorMutation.mutate(vendorData);
    } else {
      toast.error('Please fill all required fields (Full Name, Phone)');
    }
  };

  function handleAddVendorSuccess() {
    toast.success('Vendor added successfully.');
    setLoading(false);
    setVendorData({
      full_name: '',
      email: '',
      phone: '',
      address: '',
      opening_balance: 0,
    });
    queryClient.invalidateQueries({ queryKey: ['vendors'] });
    navigate('/vendors');
  }

  function handleAddVendorError(error: TError) {
    setLoading(false);
    handleApiError(error, 'Failed to add vendor. Please try again.');
  }

  const handleCancel = () => {
    navigate('/vendors');
  };

  const isLoading = addVendorMutation.isPending || loading;

  return {
    isLoading,
    vendorData,
    setVendorData,
    handleChange,
    handleAddVendor,
    handleCancel,
  };
};

export default useAddVendor;
