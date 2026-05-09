import { handleApiError } from '@/helper/error-function';
import { AdjustQtyService } from '@/services';
import { TAdjustQty } from '@/types/AdjustQty';
import { TError } from '@/types/TError';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';

const useUpdateAdjustQuantity = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [productQtyData, setProductQtyData] = useState<Partial<TAdjustQty>>({});

  const { data: productQtyById, isLoading: isProductQtyLoading } = useQuery({
    queryKey: ['adjust-quantities', id],
    queryFn: () => AdjustQtyService.adjustQtyById(id),
    enabled: !!id,
  });

  const _id = productQtyById?.product_qty?.product_id?._id;
  const sku = productQtyById?.product_qty?.product_id?.sku;

  useEffect(() => {
    if (productQtyById?.product_qty && _id) {
      setProductQtyData({
        ...productQtyById?.product_qty,
        product_id: _id,
      });
    }
  }, [productQtyById?.product_qty, _id]);

  const handleChange =
    (setter: React.Dispatch<React.SetStateAction<Partial<TAdjustQty>>>) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setter((prev) => ({
        ...prev,
        [event.target.name]: event.target.value,
      }));
    };

  // Update AdjustQty Mutation
  const updateAdjustQtyMutation = useMutation({
    mutationFn: AdjustQtyService.updateAdjustQty,
    onSuccess: handleUpdateAdjustQtySuccess,
    onError: handleUpdateAdjustQtyError,
  });

  const handleUpdateAdjustQty = () => {
    if (productQtyData?.reason) {
      setLoading(true);
      updateAdjustQtyMutation.mutate(productQtyData);
    } else {
      toast.error('Please fill the required field.');
    }
  };

  function handleUpdateAdjustQtySuccess() {
    toast.success('Product quantity updated successfully.');
    setLoading(false);
    setProductQtyData({});
    navigate(`/adjust-quantities/${_id}`);
  }

  function handleUpdateAdjustQtyError(error: TError) {
    setLoading(false);

    handleApiError(
      error,
      'Failed to update product quantity. Please try again.'
    );
  }

  const isLoading =
    updateAdjustQtyMutation.isPending || loading || isProductQtyLoading;
  return {
    isLoading,
    productQtyData,
    sku,
    _id,
    setProductQtyData,
    handleChange,
    handleUpdateAdjustQty,
    navigate,
  };
};
export default useUpdateAdjustQuantity;
