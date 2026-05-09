import {
  CustomLoader,
  CustomTable,
  Layout,
  TableIcon,
  TableRowLoader,
} from '@/components';
import { TableCell, TableRow } from '@/components/ui/table';
import { VENDOR_HEAD_DATA } from '@/constant/tableData';
import useVendors from '@/hooks/useVendors';
import useAccessStore from '@/hooks/useAccessStore';
import { ACCESS } from '@/constant/Checkbox';
import { Edit, EyeDollar } from '@/assets/svg';
import { TVendor } from '@/types/Vendor';
import { numberFormateToLocalString } from '@/helper/number-formator';
import { format } from 'date-fns';

const Vendors = () => {
  const hasAccess = useAccessStore((state) => state.hasAccess);
  const {
    isCustomerLoader,
    isTableLoader,
    vendorsData,
    pageSize,
    navigate,
    handleNextPage,
    handlePrevPage,
    handleLastPage,
    handleChangePageSize,
    handleFirstPage,
    search,
    setSearch,
  } = useVendors();

  return (
    <Layout headerTitle='Vendors' buttonLabel='Vendors'>
      <CustomLoader isLoading={isCustomerLoader} />

      <CustomTable
        searchValue={search}
        searchPlaceholder="Search"
        onChangeSearch={(e) => setSearch(e.target.value)}
        buttonLabel='+ Add Vendor'
        head={VENDOR_HEAD_DATA}
        onClickButton={() => navigate('/add-vendor')}
        disabledBtn={!hasAccess(ACCESS.add_stock_zone)}
        remaining={
          vendorsData?.length > 0
            ? `${1} - ${vendorsData?.length} of ${vendorsData?.length}`
            : '0 - 0 of 0'
        }
        handleChangePageSize={handleChangePageSize}
        handleFirstPage={handleFirstPage}
        handleLastPage={handleLastPage}
        handleNextPage={handleNextPage}
        handlePrevPage={handlePrevPage}
        pageSize={pageSize}
        disabledPagination={{
          next: true,
          prev: true,
          first: true,
          last: true,
        }}
      >
        {isTableLoader ? (
          <TableRowLoader rowsNum={10} cellsNum={VENDOR_HEAD_DATA.length} />
        ) : vendorsData?.length > 0 ? (
          vendorsData.map((vendor: TVendor, index: number) => (
            <TableRow
              key={vendor._id || index}
              className='group'
              style={{ height: '50px' }}
            >
              <TableCell className='font-medium ps-7'>
                {vendor?.full_name || 'N/A'}
              </TableCell>
              <TableCell>{vendor?.phone || 'N/A'}</TableCell>
              <TableCell>{vendor?.address || 'N/A'}</TableCell>
              <TableCell>
                {numberFormateToLocalString(Number(vendor?.to_pay ?? 0))}
              </TableCell>
              <TableCell>
                {vendor?.updatedAt
                  ? format(new Date(vendor.updatedAt), 'MMM d, yyyy')
                  : 'N/A'}
              </TableCell>
              <TableCell className='pr-5 md:pr-10'>
                <div className='flex items-center justify-center gap-3'>
                  <TableIcon
                    src={Edit}
                    alt='edit'
                    tooltipId='edit-tooltip'
                    data-tooltip-content='Edit'
                    className='bg-grey-100'
                    disabledBtn={!hasAccess(ACCESS.update_stock_zone)}
                    onClick={() => navigate(`/update-vendor/${vendor._id}`)}
                  />
                  <TableIcon
                    iconComponent={<EyeDollar width={24} height={24} />}
                    alt='EyeDollar'
                    tooltipId='delete-tooltip'
                    data-tooltip-content='View'
                    className='bg-light-red'
                    disabledBtn={!hasAccess(ACCESS.delete_stock_zone)}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell
              colSpan={VENDOR_HEAD_DATA.length}
              className='text-center'
            >
              No Vendors Found
            </TableCell>
          </TableRow>
        )}
      </CustomTable>
    </Layout>
  );
};

export default Vendors;
