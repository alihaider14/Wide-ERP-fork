import { handleApiError } from '@/helper/error-function';
import { StockZoneService } from '@/services';
import { StockZoneData } from '@/components/custom/StockZoneForm';
import { TError } from '@/types/TError';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const useAddStockZone = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [stockZoneData, setStockZoneData] = useState<Partial<StockZoneData>>({});

  const handleChange =
    (setter: React.Dispatch<React.SetStateAction<Partial<StockZoneData>>>) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setter((prev: Partial<StockZoneData>) => ({
        ...prev,
        [event.target.name]: event.target.value,
      }));
    };

  const addStockZoneMutation = useMutation({
    mutationFn: StockZoneService.addStockZone,
    onSuccess: handleAddStockZoneSuccess,
    onError: handleAddStockZoneError,
  });

  const handleAddStockZone = (stockZoneData: Partial<StockZoneData>) => {
    if (stockZoneData?.name?.trim()) {
      setLoading(true);
      addStockZoneMutation.mutate(stockZoneData);
    } else {
      toast.error('Please fill the required field');
    }
  };

  function handleAddStockZoneSuccess() {
    toast.success('Stock zone added successfully.');
    setLoading(false);
    setStockZoneData({});
    navigate('/stock-zone');
  }

  function handleAddStockZoneError(error: TError) {
    setLoading(false);
    handleApiError(error, 'Failed to add stock zone. Please try again.');
  }

  const isLoading = addStockZoneMutation.isPending || loading;

  return {
    isLoading,
    stockZoneData,
    handleChange,
    handleAddStockZone,
    setStockZoneData,
  };
};
export default useAddStockZone;
