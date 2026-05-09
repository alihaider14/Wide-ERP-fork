import { handleApiError } from '@/helper/error-function';
import { VendorService } from '@/services';
import { TVendor } from '@/types/Vendor';
import { TError } from '@/types/TError';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';

const useUpdateVendor = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [vendorData, setVendorData] = useState<Partial<TVendor>>({
    full_name: '',
    email: '',
    phone: '',
    address: '',
    opening_balance: 0,
  });

  const { data, isLoading: isVendorByIdLoading } = useQuery({
    queryKey: [`vendorById/${id}`, id],
    queryFn: () => VendorService.vendorById(id),
    enabled: !!id,
  });

  useEffect(() => {
    if (data?.vendor) {
      setVendorData(data.vendor);
    }
  }, [data]);

  const handleChange =
    (setter: React.Dispatch<React.SetStateAction<Partial<TVendor>>>) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target;
      setter((prev) => ({
        ...prev,
        [name]: name === 'opening_balance' ? Number(value) : value,
      }));
    };

  const updateVendorMutation = useMutation({
    mutationFn: VendorService.updateVendor,
    onSuccess: handleUpdateVendorSuccess,
    onError: handleUpdateVendorError,
  });

  const handleUpdateVendor = () => {
    if (vendorData?.full_name && vendorData?.phone) {
      setLoading(true);
      updateVendorMutation.mutate({ ...vendorData, _id: id as string });
    } else {
      toast.error('Please fill all required fields (Full Name, Phone)');
    }
  };

  function handleUpdateVendorSuccess() {
    toast.success('Vendor updated successfully.');
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

  function handleUpdateVendorError(error: TError) {
    setLoading(false);
    handleApiError(error, 'Failed to update vendor. Please try again.');
  }

  const handleCancel = () => {
    navigate('/vendors');
  };

  const isLoading =
    updateVendorMutation.isPending || loading || isVendorByIdLoading;

  return {
    isLoading,
    vendorData,
    setVendorData,
    handleChange,
    handleUpdateVendor,
    handleCancel,
  };
};

export default useUpdateVendor;
