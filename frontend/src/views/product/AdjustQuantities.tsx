import { Edit, HistoryIcon, PencilMinusIcon } from '@/assets/svg';
import {
  AdjustmentHistoryModal,
  CustomLoader,
  CustomTable,
  Layout,
  ReduceQtyModal,
  TableIcon,
  TableRowLoader,
} from '@/components';
import { TableCell, TableRow } from '@/components/ui/table';
import { ACCESS } from '@/constant/Checkbox';
import { ADJUSTQTY_HEAD_DATA } from '@/constant/tableData';
import { formatDateToLocaleString } from '@/helper/time-formator';
import useAccessStore from '@/hooks/useAccessStore';
import useAdjustQuantities from '@/hooks/useAdjustQuantities';
import { TUser } from '@/types/User';
import toast from 'react-hot-toast';

const AdjustQuantities = () => {
  const hasAccess = useAccessStore((state) => state.hasAccess);
  const {
    isTableLoader,
    isCustomerLoader,
    data,
    productData,
    isPaginationData,
    pageNo,
    pageSize,
    search,
    reduceQtyModal,
    reduceQtyData,
    historyModal,
    navigate,
    handleFirstPage,
    setSearch,
    handleNextPage,
    handlePrevPage,
    handleLastPage,
    handleChangePageSize,
    setReduceQtyModal,
    handleChange,
    setReduceQtyData,
    handleReduceQty,
    setHistoryModal,
  } = useAdjustQuantities();

  return (
    <Layout
      headerTitle={`${productData?.product?.sku || '<SKU>'} - Adjust Quantity`}
      buttonLink='/products'
      buttonLabel='Products'
    >
      <CustomLoader isLoading={isCustomerLoader} />

      <ReduceQtyModal
        open={reduceQtyModal.open}
        handleCancel={() => {
          setReduceQtyModal({
            open: false,
            _id: '',
          });
          setReduceQtyData({});
        }}
        onChange={handleChange(setReduceQtyData)}
        data={reduceQtyData}
        handleSumbit={handleReduceQty}
      />

      <AdjustmentHistoryModal
        open={historyModal?.open}
        _id={historyModal?._id}
        count={historyModal?.count}
        handleCancel={() => {
          setHistoryModal({
            open: false,
            _id: '',
            count: 0,
          });
        }}
      />

      <CustomTable
        buttonLabel='+ Adjust Quantity'
        head={ADJUSTQTY_HEAD_DATA}
        disabledBtn={!hasAccess(ACCESS.adjust_quantity)}
        onClickButton={() =>
          navigate('/add-quantity', {
            state: { product: productData?.product },
          })
        }
        searchValue={search}
        onChangeSearch={(e) => setSearch(e.target.value)}
        remaining={
          isPaginationData
            ? `${data?.from} - ${data?.to} of ${data?.total_rows}`
            : '0 - 0 of 0'
        }
        handleChangePageSize={handleChangePageSize}
        handleFirstPage={handleFirstPage}
        handleLastPage={handleLastPage}
        handleNextPage={handleNextPage}
        handlePrevPage={handlePrevPage}
        pageSize={pageSize}
        disabledPagination={{
          next: !isPaginationData || data?.total_pages === pageNo,
          prev: !isPaginationData || pageNo === 1,
          first: !isPaginationData || pageNo === 1,
          last: !isPaginationData || data?.total_pages === pageNo,
        }}
        searchPlaceholder='Search by reason'
      >
        {isTableLoader ? (
          <TableRowLoader rowsNum={10} cellsNum={ADJUSTQTY_HEAD_DATA.length} />
        ) : data && data?.product_quantities?.length > 0 ? (
          data?.product_quantities?.map((productQty) => {
            return (
              <TableRow key={productQty?._id} className='group'>
                <TableCell className='pl-5 md:pl-10 font-medium'>
                  {productQty?.reason || 'N/A'}
                </TableCell>
                <TableCell>{productQty?.cost || 0}</TableCell>
                <TableCell>{productQty?.quantity || 0}</TableCell>
                <TableCell>
                  <button
                    className='flex items-center gap-[10px] cursor-pointer'
                    onClick={() => {
                      if (!hasAccess(ACCESS.adjust_quantity)) {
                        toast.error("You don't have access to reduce quantity");
                      } else {
                        setReduceQtyModal({
                          open: true,
                          _id: productQty?._id,
                        });
                        setReduceQtyData({});
                      }
                    }}
                  >
                    {productQty?.remaining_qty || 0}

                    <img
                      src={PencilMinusIcon}
                      alt='PencilMinusIcon'
                      width={20}
                      height={20}
                      className='group-hover:visible group-hover:opacity-100 invisible transition-all duration-300 opacity-0 '
                    />
                  </button>
                </TableCell>
                <TableCell>
                  {formatDateToLocaleString(productQty?.updatedAt) || 'N/A'}
                </TableCell>
                <TableCell>
                  {(productQty?.created_by as TUser)?.full_name || 'N/A'}
                </TableCell>
                <TableCell className='pr-5 md:pr-10'>
                  <div className='flex items-center  gap-3'>
                    <TableIcon
                      src={Edit}
                      alt='edit'
                      tooltipId='edit-tooltip'
                      data-tooltip-content='Edit'
                      disabledBtn={
                        !hasAccess(ACCESS.adjust_quantity)
                      }
                      className='bg-grey-100'
                      onClick={() =>
                        navigate(`/update-quantity/${productQty?._id}`)
                      }
                    />
                    {productQty?.history_count > 0 && (
                      <TableIcon
                        src={HistoryIcon}
                        alt='history'
                        tooltipId='view-history-tooltip'
                        data-tooltip-content='View History'
                        className='bg-grey-100'
                        onClick={() => {
                          setHistoryModal({
                            open: true,
                            _id: productQty?._id,
                            count: productQty?.history_count,
                          });
                        }}
                        disabledBtn={
                          !hasAccess(ACCESS.adjust_quantity)
                        }
                      />
                    )}
                  </div>
                </TableCell>
              </TableRow>
            );
          })
        ) : (
          <TableRow>
            <TableCell
              colSpan={ADJUSTQTY_HEAD_DATA.length}
              className='text-center'
            >
              No Adjust Quantities Found
            </TableCell>
          </TableRow>
        )}
      </CustomTable>
    </Layout>
  );
};

export default AdjustQuantities;
