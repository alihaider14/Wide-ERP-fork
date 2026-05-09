import { handleApiError } from '@/helper/error-function';
import { OrderService } from '@/services';
import { TAddAndUpdateOrderResponse, TOrder, TOrderItems } from '@/types/Order';
import { TError } from '@/types/TError';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import useBarcodeReader from './useBarcodeReader';
import { calculateDiscount } from '@/helper/number-formator';
import useAccessStore from './useAccessStore';

const useAddOrder = () => {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState(false);
  const [cart, setCart] = useState<{ [key: string]: TOrderItems }>({});
  const [orderData, setOrderData] = useState<Partial<TOrder>>({
    customer_name: 'Walking Customer',
  });
  const { userId } = useAccessStore((state) => state);

  const handleChange =
    (setter: React.Dispatch<React.SetStateAction<Partial<TOrder>>>) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setter((prev) => ({
        ...prev,
        [event.target.name]: event.target.value,
      }));
    };

  const onAddToCart = (item: TOrderItems) => {
    if (item.product_qty! <= 0) {
      toast.error(`${item.sku} is out of stock`);
      return;
    }

    setCart((prevCart) => {
      const newCart = { ...prevCart };

      if (newCart[item.product_id]) {
        const currentQty = newCart[item.product_id].quantity || 0;
        const updatedQty =
          currentQty + 1 > item.product_qty! ? currentQty : currentQty + 1;

        newCart[item.product_id] = {
          ...item,
          quantity: updatedQty,
          total_price: updatedQty * item.price,
        };
      } else {
        newCart[item.product_id] = {
          ...item,
          quantity: 1,
          total_price: item.price,
        };
      }

      return newCart;
    });
  };

  const onUpdateCartQty = (
    type: 'increase' | 'decrease',
    item: TOrderItems
  ) => {
    setCart((prevCart) => {
      const newCart = { ...prevCart };
      const currentQty = newCart[item.product_id!]?.quantity || 0;

      if (type === 'increase') {
        if (currentQty >= item.product_qty!) {
          toast.error(
            `${item.sku} has only ${item.product_qty} units available.`
          );
          return prevCart;
        }
        newCart[item.product_id!] = {
          ...newCart[item.product_id!],
          quantity: currentQty + 1,
          total_price: (currentQty + 1) * item.price,
        };
      } else {
        const updatedQty = currentQty - 1;
        if (updatedQty > 0) {
          newCart[item.product_id!] = {
            ...newCart[item.product_id!],
            quantity: updatedQty,
            total_price: updatedQty * item.price,
          };
        } else {
          delete newCart[item.product_id!];
        }
      }

      return newCart;
    });
  };

  const onDeleteToCart = (item: TOrderItems) => {
    setCart((prevCart) => {
      const newCart = { ...prevCart };
      delete newCart[item.product_id!];
      return newCart;
    });
  };

  const onUpdateCartItem = (
    item: TOrderItems,
    updatedFields: Partial<TOrderItems>
  ) => {
    setCart((prevCart) => {
      const newCart = { ...prevCart };
      newCart[item.product_id!] = {
        ...newCart[item.product_id!],
        ...updatedFields,
      };
      if (newCart[item.product_id!].quantity! <= 0) {
        delete newCart[item.product_id!];
      }
      return newCart;
    });
  };

  // Sync orderData with cart
  useEffect(() => {
    const itemsArray = Object.values(cart).map((item) => ({
      product_id: item.product_id!,
      price: item.price,
      quantity: item.quantity!,
      original_price: item.original_price,
      total_price: item.total_price,
    }));

    const subTotal = itemsArray.reduce(
      (sum, i) => sum + i.price * i.quantity,
      0
    );
    const totalAmount = calculateDiscount(subTotal, orderData.discount || '0');
    const itemsCount = itemsArray.reduce((sum, i) => sum + i.quantity, 0);

    setOrderData((prev) => ({
      ...prev,
      items: itemsArray,
      items_count: itemsCount,
      sub_total_amount: subTotal,
      total_amount: totalAmount,
    }));
  }, [cart, orderData.discount]);

  // Add Order Mutation
  const addOrderMutation = useMutation({
    mutationFn: OrderService.addOrder,
    onSuccess: handleAddOrderSuccess,
    onError: handleAddOrderError,
  });

  const handleAddOrder = (status?: 'completed' | 'cancelled' | 'drafted') => {
    if (!orderData.items || orderData.items.length === 0) {
      toast.error('Please add products on the cart.');
      return;
    }

    addOrderMutation.mutate({
      ...orderData,
      status,
      created_by: userId as string,
    });
  };

  function handleAddOrderSuccess(data: TAddAndUpdateOrderResponse) {
    toast.success('Order added successfully.');
    setOrderData({});
    setCart({});

    if (data?.order?.status === 'completed') {
      navigate('/order-completed', {
        state: {
          order: {
            ...data.order,
            recieved_amount: orderData?.recieved_amount,
          },
        },
      });
    } else navigate('/orders');
  }

  function handleAddOrderError(error: TError) {
    handleApiError(error, 'Failed to add order. Please try again.');
  }

  useBarcodeReader({ onAddToCart });

  const isLoading = addOrderMutation?.isPending;

  return {
    prompt,
    cart,
    orderData,
    isLoading,
    setPrompt,
    onAddToCart,
    onUpdateCartQty,
    setOrderData,
    handleChange,
    handleAddOrder,
    onDeleteToCart,
    onUpdateCartItem,
  };
};

export default useAddOrder;
