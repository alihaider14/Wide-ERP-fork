import {
  Cancelled,
  Edit,
  HistoryIcon,
  PrintReciept,
  Restore,
} from "@/assets/svg";
import {
  CustomLoader,
  CustomTable,
  Layout,
  OrderItemsModal,
  OrderLogHistoryModal,
  PageHeader,
  Prompt,
  TableIcon,
  TableRowLoader,
} from "@/components";
import {TableCell, TableRow} from "@/components/ui/table";
import {ORDERS_HEAD_DATA} from "@/constant/tableData";
import useOrders from "@/hooks/useOrders";
import {COLOR} from "@/constant/Colors";
import {ChevronDownIcon} from "lucide-react";
import useAccessStore from "@/hooks/useAccessStore";
import {ACCESS} from "@/constant/Checkbox";
import {numberFormateToLocalString} from "@/helper/number-formator";
import {DateRangePicker} from "@/components/custom/DatePickerRange";

const Orders = () => {
  const hasAccess = useAccessStore((state) => state.hasAccess);
  const {
    search,
    isPaginationData,
    isCustomerLoader,
    isTableLoader,
    data,
    pageNo,
    pageSize,
    prompt,
    orderItemsModal,
    dateRange,
    historyModal,
    navigate,
    setSearch,
    handleNextPage,
    handlePrevPage,
    handleLastPage,
    handleChangePageSize,
    handleFirstPage,
    handleOpenPrompt,
    handleCancelPrompt,
    handleSumbitPrompt,
    setOrderItemsModal,
    setDateRange,
    setHistoryModal,
  } = useOrders();

  const handleDateRangeChange = (range: {from?: Date; to?: Date}) => {
    if (range.from) {
      setDateRange({from: range.from, to: range.to});
    }
  };

  return (
    <Layout>
      <CustomLoader isLoading={isCustomerLoader} />

      <Prompt
        open={prompt?.open || false}
        title={`Order # ${prompt?.data?.order_number}`}
        description={`Are you sure that you want to ${
          prompt?.data?.status === "cancelled" ? "restore" : "cancel"
        } the order? `}
        handleSumbit={handleSumbitPrompt}
        handleCancel={handleCancelPrompt}
        cancelButtonText="No"
        sumbitButtonText={`Yes, ${
          prompt?.data?.status === "cancelled" ? "restore" : "cancel"
        } the order`}
        sumbitButtonVariant={
          prompt?.data?.status === "cancelled" ? "default" : "destructive"
        }
      />

      <OrderItemsModal
        open={orderItemsModal?.open}
        handleCancel={() => {
          setOrderItemsModal({
            ...orderItemsModal,
            open: false,
          });
        }}
        _id={orderItemsModal?._id}
      />

      <PageHeader heading="Orders" />
      
      <OrderLogHistoryModal
        open={historyModal?.open}
        _id={historyModal?._id}
        order_no={historyModal?.order_no}
        handleCancel={() => {
          setHistoryModal({
            open: false,
            _id: "",
            order_no: 0,
          });
        }}
      />

      <div className="h-5" />

      <CustomTable
        buttonLabel="+ Add Order"
        disabledBtn={!hasAccess(ACCESS.create_order)}
        head={ORDERS_HEAD_DATA}
        onClickButton={() => navigate("/add-order")}
        searchValue={search}
        onChangeSearch={(e) => setSearch(e.target.value)}
        searchRightComponent={
          <DateRangePicker
            initialValue={dateRange}
            onDateRangeChange={handleDateRangeChange}
          />
        }
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
        searchPlaceholder="Search"
        isPaginationText={`Today's Sale: ${
          data?.today_sales
            ? numberFormateToLocalString(Number(data?.today_sales)) || 0
            : 0
        }`}
      >
        {isTableLoader ? (
          <TableRowLoader rowsNum={10} cellsNum={ORDERS_HEAD_DATA.length} />
        ) : data && data?.orders?.length > 0 ? (
          data?.orders?.map((order, index) => {
            return (
              <TableRow key={index} className="group">
                <TableCell className="pl-5 md:pl-10 font-medium">
                  {order?.order_number || "N/A"}
                </TableCell>
                <TableCell>{order?.customer_name || "N/A"}</TableCell>
                <TableCell>{order?.customer_phone || "N/A"}</TableCell>
                <TableCell>
                  {numberFormateToLocalString(Number(order?.total_amount)) || 0}
                  {order?.discount ? (
                    <span className="ml-2 text-xs text-gray-400">
                      (Disc. {order.discount})
                    </span>
                  ) : null}
                </TableCell>
                <TableCell>
                  <div
                    className="flex items-center gap-[10px] cursor-pointer"
                    onClick={() => {
                      setOrderItemsModal({
                        open: true,
                        _id: order?._id,
                      });
                    }}
                  >
                    {order?.items_count || 0}

                    <ChevronDownIcon
                      color={COLOR?.semiBlack}
                      className="size-[14px] group-hover:visible group-hover:opacity-100 invisible transition-all duration-300 opacity-0 "
                    />
                  </div>
                </TableCell>
                <TableCell className="font-medium text-xs">
                  <div
                    className={`${
                      order?.status === "cancelled"
                        ? "bg-secondary-red text-red"
                        : order?.status === "completed"
                          ? "bg-light-green text-green"
                          : "bg-secondary-purple text-purple "
                    } text-center w-20 h-6 rounded-[3px] flex items-center justify-center capitalize`}
                  >
                    {order?.status || "N/A"}
                  </div>
                </TableCell>
                <TableCell className="pr-5 md:pr-10">
                  <div className="flex items-center justify-center gap-3">
                    <TableIcon
                      src={PrintReciept}
                      alt="printReciept"
                      tooltipId="printReciept-tooltip"
                      data-tooltip-content="Print Reciept"
                      className="bg-grey-100"
                      onClick={() => {}}
                    />

                    <TableIcon
                      src={Edit}
                      alt="edit"
                      tooltipId="edit-tooltip"
                      data-tooltip-content="Edit"
                      className="bg-grey-100"
                      disabledBtn={!hasAccess(ACCESS.update_order)}
                      onClick={() => {
                        navigate(`/update-order/${order?._id}`);
                      }}
                    />

                    <TableIcon
                      src={order?.status === "cancelled" ? Restore : Cancelled}
                      alt="statusIcon"
                      tooltipId="statusIcon-tooltip"
                      data-tooltip-content={
                        order?.status === "cancelled" ? "Restore" : "Cancel"
                      }
                      disabledBtn={!hasAccess(ACCESS.update_order_status)}
                      className={`${
                        order?.status === "cancelled"
                          ? "bg-light-purple"
                          : "bg-light-red"
                      }`}
                      onClick={() => handleOpenPrompt(order)}
                    />

                    <TableIcon
                      src={HistoryIcon}
                      alt="history"
                      tooltipId="view-history-tooltip"
                      data-tooltip-content="View History"
                      className="bg-grey-100"
                      onClick={() => {
                        setHistoryModal({
                          open: true,
                          _id: order?._id,
                          order_no: order?.order_number,
                        });
                      }}
                      disabledBtn={!hasAccess(ACCESS.view_order_history)}
                    />
                  </div>
                </TableCell>
              </TableRow>
            );
          })
        ) : (
          <TableRow>
            <TableCell
              colSpan={ORDERS_HEAD_DATA.length}
              className="text-center"
            >
              No Orders Found
            </TableCell>
          </TableRow>
        )}
      </CustomTable>
    </Layout>
  );
};

export default Orders;
