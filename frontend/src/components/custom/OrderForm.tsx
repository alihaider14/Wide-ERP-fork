import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '@/services/product-service';
import { useDebounce } from '@/hooks/useDebounce';
import { TOrder, TOrderItems } from '@/types/Order';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import SearchInput from './SearchInput';
import SimpleTable from './SimpleTable';
import { ORDER_CART_HEAD_DATA } from '@/constant/tableData';
import { TableCell, TableRow } from '../ui/table';
import { MinusCircle, PlusCircle, Trash } from '@/assets/svg';
import TableIcon from './TableIcon';
import ScaleLoader from 'react-spinners/ScaleLoader';
import { COLOR } from '@/constant/Colors';
import { handleApiError } from '@/helper/error-function';
import { TError } from '@/types/TError';
import { numberFormateToLocalString } from '@/helper/number-formator';

type TProps = {
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  data?: Partial<TOrder>;
  onAddToCart: (product: TOrderItems) => void;
  onDeleteToCart: (product: TOrderItems) => void;
  cart: { [key: string]: TOrderItems };
  onUpdateCartQty: (
    type: 'increase' | 'decrease',
    product: TOrderItems
  ) => void;
  handleCheckout?: () => void;
  disabledBtn?: boolean;
  onUpdateCartItem: (
    product: TOrderItems,
    updatedFields: Partial<TOrderItems>
  ) => void;
};

const OrderForm = ({
  onChange,
  data,
  cart,
  onAddToCart,
  onUpdateCartQty,
  handleCheckout,
  onDeleteToCart,
  disabledBtn,
  onUpdateCartItem,
}: TProps) => {
  const [search, setSearch] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const debounceSearch = useDebounce(search);

  const {
    data: availableProducts,
    error,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['productsForOrder', 1, 10, undefined, debounceSearch],
    queryFn: () => getProducts(1, 10, 'active', undefined, debounceSearch),
    enabled: !!isFocused && Boolean(debounceSearch.length > 2),
  });

  if (isError)
    handleApiError(error as unknown as TError, 'Oops! something went wrong');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isFocused || availableProducts?.products.length === 0) return;

      if (e.key === 'ArrowDown') {
        setSelectedIndex((prevIndex) =>
          prevIndex < availableProducts!.products.length - 1 ? prevIndex + 1 : 0
        );
      } else if (e.key === 'ArrowUp') {
        setSelectedIndex((prevIndex) =>
          prevIndex > 0 ? prevIndex - 1 : availableProducts!.products.length - 1
        );
      } else if (e.key === 'Enter') {
        const product = availableProducts?.products[selectedIndex];

        onAddToCart({
          product_id: product!._id,
          price: product?.price || 0,
          sku: product?.sku,
          quantity: product?.qty || 0,
          product_qty: product?.qty || 0,
          original_price: product?.price || 0,
        });
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isFocused, selectedIndex, availableProducts, onAddToCart]);

  return (
    <div className='w-full bg-white border border-border rounded-[5px] '>
      {/* Input Fields */}
      <div className='flex lg:flex-row flex-col items-end justify-between py-5 px-5 md:px-10 gap-x-10 gap-y-5 flex-wrap'>
        <div className='flex lg:flex-row flex-col lg:items-center gap-5 w-full lg:w-auto flex-wrap'>
          <Input
            placeholder='Customer Name'
            name='customer_name'
            onChange={onChange}
            value={data?.customer_name || ''}
            label='Customer Name'
            containerClassName='lg:min-w-[300px]'
          />
          <Input
            placeholder='e.g. 03012345678 or +923012345678'
            name='customer_phone'
            onChange={onChange}
            value={data?.customer_phone || ''}
            label='Phone'
            type='text'
          />
          <Input
            placeholder='e.g. 10%'
            name='discount'
            value={data?.discount || ''}
            label='Discount'
            type='text'
            onChange={(e) => {
              const inputValue = e.target.value;

              if (/^\d*%?$/.test(inputValue)) {
                onChange?.(e);
              }
            }}
          />
          <Input
            placeholder='e.g. 500'
            name='recieved_amount'
            onChange={onChange}
            value={data?.recieved_amount || ''}
            label='Amount Received'
            type='number'
            min={0}
          />
        </div>
        <Button
          className='lg:min-w-[192px] w-full lg:w-auto'
          onClick={handleCheckout}
          disabled={disabledBtn}
        >
          Checkout
        </Button>
      </div>

      <div className='border-t border-border'>
        <div className='h-[60px] py-3 px-5 md:px-10 flex items-center justify-center bg-grey-100 relative '>
          <SearchInput
            value={search || ''}
            onChange={(e) => setSearch(e.target.value)}
            placeholder='Search product by SKU or Barcode'
            className='w-full'
            isFocusButtons
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          />

          <div
            className={`absolute flex flex-col left-5 md:left-10  top-14 lg:min-h-[600px] w-[80%] lg:max-w-[650px] border-border border shadow-[0_4px_8px_3px] shadow-shadow rounded-[5px] bg-white z-50  overflow-auto
					transition-all duration-300 ${
            Boolean(debounceSearch.length > 2) && isFocused
              ? 'opacity-100 scale-y-100'
              : 'opacity-0 scale-y-0'
          }
				`}
            onMouseDown={(e) => e.preventDefault()}
          >
            {isLoading ? (
              <div className='w-full h-full flex items-center justify-center flex-1 p-5 md:p-10'>
                <ScaleLoader loading={isLoading} color={COLOR.blue} />
              </div>
            ) : availableProducts && availableProducts?.products?.length > 0 ? (
              availableProducts?.products?.map((item, index) => {
                return (
                  <div
                    className={`flex items-center justify-between px-5 md:px-10 min-h-[60px] last:border-b-0 last:lg:border-b border-b border-border group gap-5 py-2 transition-all 
										${selectedIndex === index ? 'bg-muted/50 ' : 'hover:bg-muted/50'}
									`}
                    key={index}
                    onClick={() => {
                      onAddToCart({
                        product_id: item?._id,
                        price: item?.price,
                        sku: item?.sku,
                        quantity: item.qty!,
                        product_qty: item.qty!,
                        original_price: item?.price,
                      });
                    }}
                  >
                    <div className='flex items-center gap-x-5 gap-y-2 flex-wrap text-start w-[60%] justify-between text-foreground text-sm'>
                      <span>{item?.sku || ''}</span>
                      <span>Qty: {item?.qty || 0}</span>
                    </div>

                    <Button
                      variant='ghostSecondary'
                      className={`${
                        selectedIndex === index
                          ? 'opacity-100 visible delay-200'
                          : 'opacity-0 invisible'
                      } transition-all duration-300 text-xs font-normal h-[24px] w-[50px] px-0 py-0 group-hover:opacity-100 group-hover:visible
														`}
                    >
                      Enter
                    </Button>
                  </div>
                );
              })
            ) : (
              <div className='flex items-center justify-center h-[60px] border-b border-border'>
                <span className='text-center whitespace-nowrap text-nowrap text-sm leading-[21px] font-normal text-foreground'>
                  {debounceSearch.length > 0
                    ? "Oops! We couldn't find any matches."
                    : 'No Product Found'}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className='w-full flex flex-col justify-between '>
          <SimpleTable head={ORDER_CART_HEAD_DATA}>
            {Object.values(cart).length > 0 ? (
              Object.values(cart).map((product, index) => (
                <TableRow key={index}>
                  <TableCell className='pl-5 md:pl-10 font-medium'>
                    {product?.sku || 'N/A'}
                  </TableCell>
                  <TableCell className='text-center'>
                    <Input
                      placeholder='e.g. 500'
                      name='price'
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        onUpdateCartItem(product, {
                          price: Number(value?.toFixed(0)),
                          total_price:
                            Number((value * product?.quantity).toFixed(0)) || 0,
                        });
                      }}
                      value={product?.price.toFixed(0) || ''}
                      type='number'
                      min={0}
                    />
                  </TableCell>
                  <TableCell className='flex items-center justify-center h-[60px]'>
                    <div className='flex items-center justify-between gap-[13px] max-w-[100px] '>
                      <img
                        src={MinusCircle}
                        alt='MinusCircle'
                        className='cursor-pointer'
                        onClick={() =>
                          onUpdateCartQty('decrease', {
                            product_id: product.product_id!,
                            price: product?.price,
                            sku: product?.sku,
                            quantity: product.quantity!,
                            product_qty: product.product_qty!,
                            original_price: product?.original_price,
                          })
                        }
                      />
                      <span className='font-normal text-sm text-foreground text-center'>
                        {product?.quantity || 0}
                      </span>
                      <img
                        src={PlusCircle}
                        alt='PlusCircle'
                        className='cursor-pointer'
                        onClick={() =>
                          onUpdateCartQty('increase', {
                            product_id: product.product_id!,
                            price: product?.price,
                            sku: product?.sku,
                            quantity: product.quantity!,
                            product_qty: product.product_qty!,
                            original_price: product?.original_price,
                          })
                        }
                      />
                    </div>
                  </TableCell>
                  <TableCell className='text-center'>
                    <Input
                      placeholder='e.g. 500'
                      name='total_price'
                      onChange={(e) => {
                        const value = Number(e.target.value);

                        onUpdateCartItem(product, {
                          total_price: Number(value?.toFixed(0)),
                          price:
                            Number((value / product?.quantity).toFixed(0)) || 0,
                        });
                      }}
                      value={
                        product.total_price! >= 0
                          ? product?.total_price?.toFixed(0)
                          : Number(product?.price * product?.quantity).toFixed(
                              2
                            ) || ''
                      }
                      type='number'
                      min={0}
                    />
                  </TableCell>
                  <TableCell className='pr-5 md:pr-10 pl-10 flex items-center justify-center h-[60px]'>
                    <TableIcon
                      src={Trash}
                      alt='Trash'
                      tooltipId='delete-tooltip'
                      data-tooltip-content='Delete'
                      onClick={() => {
                        onDeleteToCart(product);
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={ORDER_CART_HEAD_DATA.length}
                  className='text-center'
                >
                  No Products Found In Cart
                </TableCell>
              </TableRow>
            )}
          </SimpleTable>

          <div className='border-t border-border min-h-[60px] text-sm text-secondary-foreground rounded-b-[5px] bg-grey-100 flex flex-row flex-wrap gap-y-3 gap-x-5 items-center justify-between text-nowrap px-5 md:px-10'>
            <span className='font-medium !text-sm text-foreground'>CART</span>
            <span>Items. {data?.items_count || 0}</span>
            <span>
              Disc.{' '}
              {data?.sub_total_amount && data?.total_amount
                ? numberFormateToLocalString(
                    data?.sub_total_amount - Number(data?.total_amount)
                  )
                : 0}
            </span>
            <span>
              Amount.{' '}
              {numberFormateToLocalString(Number(data?.sub_total_amount)) || 0}
            </span>
            <span className='font-medium text-[20px] text-foreground'>
              Payable:{' '}
              
              {numberFormateToLocalString(Number(data?.total_amount)) || 0}
            </span>

            <span className='font-medium text-sm text-red-dark'>
              Changes Due:{' '}
              {data?.total_amount &&
              data?.recieved_amount &&
              data?.recieved_amount >= data?.total_amount
                ? numberFormateToLocalString(
                    Number(data?.recieved_amount - data?.total_amount)
                  )
                : 0}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderForm;
