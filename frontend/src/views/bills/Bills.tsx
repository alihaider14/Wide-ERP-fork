import { Edit, Trash } from "@/assets/svg";
import Layout from "@/components/Layout";
import CustomLoader from "@/components/custom/CustomLoader";
import CustomTable from "@/components/custom/CustomTable";
import { DeletionConfirmation } from "@/components/custom/DeletionConfirmation";
import TableIcon from "@/components/custom/TableIcon";
import TableRowLoader from "@/components/custom/TableRowLoader";
import { DateRangePicker } from "@/components/custom/DatePickerRange";
import { TableCell, TableRow } from "@/components/ui/table";
import { BILLS_HEAD_DATA } from "@/constant/tableData";
import { COLOR } from "@/constant/Colors";
import { numberFormateToLocalString } from "@/helper/number-formator";
import useBills from "@/hooks/useBills";
import { format } from "date-fns";
import { ChevronDownIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BillItemsModal from "./BillItemsModal";

const Bills = () => {
	const navigate = useNavigate();
	const {
		search,
		setSearch,
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
		handleDeleteBill,
		confirmDeleteBill,
		cancelDeleteBill,
		todayPurchasing,
		hoveredRow,
		setHoveredRow,
		modalOpen,
		setModalOpen,
		modalItems,
		modalLoading,
		handleShowBillItems,
		dateRange,
		handleDateRangeChange,
		data,
		loading,
		deleteModalOpen,
		billToDelete,
	} = useBills();

	return (
		<Layout headerTitle='Bills'>
			<CustomLoader isLoading={loading && !deleteModalOpen} />

			<CustomTable
				head={BILLS_HEAD_DATA}
				headerRowHeight='50px'
				bodyRowHeight='50px'
				bodyCellPaddingY='0px'
				buttonLabel='+ Add Bill'
				onClickButton={() => navigate("/add-bill")}
				searchValue={search}
				onChangeSearch={(e) => setSearch(e.target.value)}
				searchRightComponent={
					<DateRangePicker
						initialValue={dateRange}
						onDateRangeChange={handleDateRangeChange}
						className='min-w-[251px] h-9 rounded-[3px] border py-1.5 px-4 w-full gap-3 opacity-100 flex-nowrap whitespace-nowrap 2xl:px-2 2xl:gap-1 2xl:max-w-[251px]'
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
				searchPlaceholder='Search bill'
				isPaginationText={`Today's Purchasing: ${numberFormateToLocalString(
					todayPurchasing,
				)}`}
			>
				{isTableLoader ? (
					<TableRowLoader rowsNum={10} cellsNum={BILLS_HEAD_DATA.length} />
				) : paginatedData && paginatedData.length > 0 ? (
					paginatedData.map((bill, index) => (
						<TableRow key={index} className='group' style={{ color: COLOR.semiBlack }}>
							<TableCell className='pl-5 md:pl-10 font-medium'>
								{bill.bill_no || "N/A"}
							</TableCell>

							<TableCell>{bill.vendor?.name || "N/A"}</TableCell>

							<TableCell>
								{numberFormateToLocalString(Number(bill.amount)) || 0}
							</TableCell>

							<TableCell>
								<div
									className='flex items-center gap-2.5 cursor-pointer'
									onMouseEnter={() => setHoveredRow(String(bill._id))}
									onMouseLeave={() => setHoveredRow(null)}
									onClick={() => handleShowBillItems(bill._id)}
								>
									{Array.isArray(bill.items)
										? bill.items.reduce((sum, item) => sum + (item.qty || 0), 0)
										: bill.items || 0}

									<ChevronDownIcon
										color={COLOR.semiBlack}
										className={`size-3.5 ${hoveredRow === String(bill._id)
											? "visible opacity-100"
											: "invisible opacity-0"
											} group-hover:visible group-hover:opacity-100 transition-all duration-300 ml-1`}
									/>
								</div>
							</TableCell>

							<TableCell>
								{bill.bill_date
									? format(new Date(bill.bill_date), "EEE, LLL dd, yyyy")
									: "N/A"}
							</TableCell>

							<TableCell>
								{bill.createdAt
									? format(new Date(bill.createdAt), "EEE, LLL dd, yyyy")
									: "N/A"}
							</TableCell>

							<TableCell>
								{bill.updatedAt && bill.updatedAt !== bill.createdAt
									? format(new Date(bill.updatedAt), "EEE, LLL dd, yyyy")
									: bill.createdAt
										? format(new Date(bill.createdAt), "EEE, LLL dd, yyyy")
										: "N/A"}
							</TableCell>

							<TableCell className='pr-5 md:pr-10'>
								<div className='flex items-center justify-center gap-3'>
									<TableIcon
										src={Edit}
										alt='edit'
										tooltipId='edit-bill-tooltip'
										data-tooltip-content='Edit'
										className='bg-grey-100'
										onClick={() => navigate(`/update-bill/${bill._id}`)}
									/>
									<TableIcon
										src={Trash}
										alt='delete'
										tooltipId='delete-bill-tooltip'
										data-tooltip-content='Delete'
										className='bg-light-red'
										onClick={() =>
											handleDeleteBill(
												bill._id,
												bill.bill_no ? String(bill.bill_no) : "N/A",
												bill.vendor?.name || "Unknown Vendor",
											)
										}
									/>
								</div>
							</TableCell>
						</TableRow>
					))
				) : (
					<TableRow>
						<TableCell colSpan={BILLS_HEAD_DATA.length} className='text-center'>
							No Bills Found
						</TableCell>
					</TableRow>
				)}
			</CustomTable>

			<BillItemsModal
				open={modalOpen}
				onClose={() => setModalOpen(false)}
				items={modalItems}
				loading={modalLoading}
			/>

			{billToDelete && (
				<DeletionConfirmation
					open={deleteModalOpen}
					title={`Delete Bill #${billToDelete.billNumber}`}
					description={
						<>
							Removing the bill will reduce the product quantities and reduce the
							vendor's billing amount. Are you sure you want to delete the bill for{" "}
							<span className='font-semibold'>{billToDelete.vendorName}</span>?
						</>
					}
					confirmText='Delete Bill'
					confirmLoadingText='Deleting...'
					handleDelete={confirmDeleteBill}
					handleCancel={cancelDeleteBill}
					isDeleting={loading}
				/>
			)}
		</Layout>
	);
};

export default Bills;
