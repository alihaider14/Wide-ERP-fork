import Layout from "@/components/Layout";
import CustomLoader from "@/components/custom/CustomLoader";
import CustomTable from "@/components/custom/CustomTable";
import { DeletionConfirmation } from "@/components/custom/DeletionConfirmation";
import NoteTooltip from "@/components/custom/NoteTooltip";
import TableIcon from "@/components/custom/TableIcon";
import TableRowLoader from "@/components/custom/TableRowLoader";
import { TableCell, TableRow } from "@/components/ui/table";
import { DateRangePicker } from "@/components/custom/DatePickerRange";
import { PAYMENTS_HEAD_DATA } from "@/constant/tableData";
import { numberFormateToLocalString } from "@/helper/number-formator";
import { toStableLocalDate } from "@/helper/payment-date";
import usePayments from "@/hooks/usePayments";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { Edit, Message, Trash } from "@/assets/svg";

const Payments = () => {
  const navigate = useNavigate();
  const {
    search,
    setSearch,
    dateRange,
    handleDateRangeChange,
    isPaginationData,
    isTableLoader,
    paginatedData,
    pageNo,
    pageSize,
    handleNextPage,
    handlePrevPage,
    handleLastPage,
    handleFirstPage,
    handleChangePageSize,
    data,
    loading,
    handleDeletePayment,
    confirmDeletePayment,
    cancelDeletePayment,
    deleteModalOpen,
    paymentToDelete,
  } = usePayments();

  return (
    <Layout headerTitle='Payments'>
      <CustomLoader isLoading={loading && !deleteModalOpen} />

      <CustomTable
        head={PAYMENTS_HEAD_DATA}
        headerRowHeight='50px'
        bodyRowHeight='50px'
        bodyCellPaddingY='0px'
        buttonLabel='+ Add Payment'
        onClickButton={() => navigate("/add-payment")}
        searchValue={search}
        onChangeSearch={(e) => setSearch(e.target.value)}
        remaining={
          isPaginationData
            ? `${data?.from} - ${data?.to} of ${data?.total_rows}`
            : "0 - 0 of 0"
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
        searchRightComponent={
          <DateRangePicker
            initialValue={dateRange}
            onDateRangeChange={handleDateRangeChange}
            className='min-w-62.5 h-9 rounded-[3px] border py-1.5 px-4 gap-3 w-full opacity-100 flex-nowrap whitespace-nowrap 2xl:px-2 2xl:gap-1 2xl:max-w-62.75'
          />
        }
        searchPlaceholder='Search by name, payment no. or amount'
      >
        {isTableLoader ? (
          <TableRowLoader rowsNum={10} cellsNum={PAYMENTS_HEAD_DATA.length} />
        ) : paginatedData && paginatedData.length > 0 ? (
          paginatedData.map((payment, index) => (
            <TableRow key={index} className='group text-semi-black'>
              <TableCell className='px-5 md:pl-10 2xl:pl-5  font-medium'>
                {payment.payment_no || "N/A"}
              </TableCell>

              <TableCell className='2xl:px-0'>
                <div className='inline-flex items-center gap-3 max-w-full'>
                  <span className='truncate font-medium text-sm leading-none tracking-normal align-middle h-[21px] flex items-center'>{payment.vendor_name || "N/A"}</span>
                  {payment.note?.trim() ? (
                    <NoteTooltip
                      tooltipId={`payment-note-tooltip-${payment._id}`}
                      note={payment.note}
                    >
                      <img
                        src={Message}
                        alt='message'
                        className='w-4 h-4 shrink-0 cursor-pointer'
                      />
                    </NoteTooltip>
                  ) : null}
                </div>
              </TableCell>

              <TableCell className="2xl:px-0">
                {numberFormateToLocalString(Number(payment.paid_amount)) || 0}
              </TableCell>

              <TableCell className="2xl:px-0">
                {numberFormateToLocalString(Number(payment.current_balance)) || 0}
              </TableCell>

              <TableCell className="2xl:px-0">
                {numberFormateToLocalString(Number(payment.remaining_balance)) || 0}
              </TableCell>

              <TableCell className="2xl:px-0">
                {payment.paid_at
                  ? format(toStableLocalDate(payment.paid_at), "LLL d, yyyy")
                  : "N/A"}
              </TableCell>

              <TableCell className="2xl:px-0">
                {payment.updatedAt
                  ? format(new Date(payment.updatedAt), "LLL d, yyyy")
                  : "N/A"}
              </TableCell>

              <TableCell className='pr-5 md:pr-10 2xl:px-0 2xl:pr-5'>
                <div className='flex items-center justify-center gap-3'>
                  <TableIcon
                    src={Edit}
                    alt='edit'
                    tooltipId='edit-payment-tooltip'
                    data-tooltip-content='Edit'
                    className='bg-grey-100'
                    onClick={() =>
                      navigate(`/update-payment/${payment._id}`, {
                        state: { payment },
                      })
                    }
                  />
                  <TableIcon
                    src={Trash}
                    alt='delete'
                    tooltipId='delete-payment-tooltip'
                    data-tooltip-content='Delete'
                    className='bg-light-red'
                    onClick={() =>
                      handleDeletePayment(
                        payment._id,
                        payment.payment_no ? String(payment.payment_no) : "N/A",
                        payment.vendor_name || "Unknown Vendor"
                      )
                    }
                  />
                </div>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow className='text-semi-black'>
            <TableCell colSpan={PAYMENTS_HEAD_DATA.length} className='text-center'>
              No Payments Found
            </TableCell>
          </TableRow>
        )}
      </CustomTable>

      {paymentToDelete && (
        <DeletionConfirmation
          open={deleteModalOpen}
          title={`Delete P. No. ${paymentToDelete.paymentNo}`}
          description={
            <>
              Removing the payment will increase the vendor&apos;s billing amount.
              Are you sure to delete the payment for{" "}
              <span className='font-semibold'>{paymentToDelete.vendorName}</span>?
            </>
          }
          confirmText='Delete Payment'
          confirmLoadingText='Deleting...'
          handleDelete={confirmDeletePayment}
          handleCancel={cancelDeletePayment}
          isDeleting={loading}
        />
      )}
    </Layout>
  );
};

export default Payments;
