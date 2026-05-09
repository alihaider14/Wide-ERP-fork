import {
	Layout,
	CustomTable,
	PackagingSlipPdfGenerator,
	CustomLoader,
	TableRowLoader,
	ScanModal,
	ScannedOrderPdfGenerator,
} from "@/components";
import useShopify from "@/hooks/useShopify";
import CustomAutocomplete from "@/components/custom/CustomAutocomplete";
import { CITIES } from "@/constant/cities";
import { COURIERS } from "@/constant/couriers";
import { TableCell, TableRow } from "@/components/ui/table";
import { STATUS_CARDS } from "@/constant/tableData";
import type { ShopifyRow, TNoteModalKind } from "@/types/shopify";
import AddNoteModal from "@/components/custom/add-note-modal";
import StatusCardFilter from "@/components/custom/StatusCardFilter";
import ShopifyTableRow from "@/components/custom/ShopifyTableRow";
import UpdateAddressModal from "@/components/custom/update-address-modal";
import toast from "react-hot-toast";

const Shopify = () => {
	const {
		search,
		setSearch,
		pageNo,
		pageSize,
		handleChangePageSize,
		handleNextPage,
		handlePrevPage,
		handleFirstPage,
		handleLastPage,
		totalPages,
		hasNextPage,
		isCursorBased,
		selectedShop,
		setSelectedShop,
		hoveredRow,
		setHoveredRow,
		showShopColumn,
		DYNAMIC_HEAD,
		activeStatus,
		setActiveStatus,
		statusFilteredOrders,
		isRowSelected,
		toggleRow,
		ACTIVE_HEAD,
		noteModal,
		setNoteModal,
		activeNoteRow,
		setActiveNoteRow,
		shopList,
		updateShopifyOrderNote,
		updateShopifyOrderAddress,
		packagingSlipPdfRef,
		pdfData,
		isTableLoader,
		isCustomerLoader,
		setScanModal,
		scanModal,
		handleScan,
		addressModal,
		setAddressModal,
		noteIndicatorRef,
		isScanning,
		printScannedOrderData,
		scannedOrderPdfRef,
		couriers,
		selectedCourier,
		setSelectedCourier,
		selectedCity,
		setSelectedCity,
		hiddenColumns,
		navigate,
		clearSelection
	} = useShopify();

	return (
		<Layout
			headerTitle='Shopify'
			shopList={shopList}
			selectedShop={selectedShop}
			setSelectedShop={setSelectedShop}
			clearSelection={clearSelection}
		>
			<CustomLoader isLoading={isCustomerLoader} />
			<StatusCardFilter
				statusCards={STATUS_CARDS}
				activeStatus={activeStatus}
				onStatusChange={setActiveStatus}
			/>

			<CustomTable
				head={ACTIVE_HEAD}
				headerRowHeight='50px'
				bodyRowHeight='50px'
				bodyCellPaddingY='0px'
				searchValue={search}
				onChangeSearch={(e: React.ChangeEvent<HTMLInputElement>) =>
				{
					clearSelection();
					setSearch(e.target.value)
				}
				}
				searchPlaceholder='Search'
				searchClassName='xl:min-w-[500px]'
				searchAdjacentComponent={
					<div className='flex items-center gap-5'>
						{activeStatus !== "Pending" && activeStatus !== "Ready to Ship" && (
							<CustomAutocomplete
								placeholder='Courier'
								value={selectedCourier}
								handleSelect={(item) => {
									clearSelection();
									setSelectedCourier(item.id === selectedCourier ? "" : item.id);
								}
								}
								onClear={() => {
									clearSelection();
									setSelectedCourier("");
								}}
								className='w-48 h-9 placeholder:text-grey placeholder:text-sm placeholder:font-normal'
								data={
									selectedShop
										? couriers.map((c: { _id: string; name: string }) => ({
												id: c.name,
												name: c.name,
										}))
										: COURIERS
								}
								dropdownClassName='rounded-[4px] border-borderColor p-0 gap-0'
								itemClassName='border-b-[0.5px] border-borderColor/50 p-2 rounded-none last:border-b-0 hover:bg-neutral-100'
							/>
						)}
						<CustomAutocomplete
							placeholder='City'
							value={selectedCity}
							handleSelect={(item) =>{
								clearSelection();
								setSelectedCity(item.id === selectedCity ? "" : item.id)
							}
							}
							onClear={() => {
								clearSelection();
								setSelectedCity(""); 
							}}
							className='w-48 h-9 placeholder:text-grey placeholder:text-sm placeholder:font-normal'
							data={CITIES}
							dropdownClassName='rounded-[4px] border-borderColor p-0 gap-0'
							itemClassName='border-b-[0.5px] border-borderColor/50 p-2 rounded-none last:border-b-0 hover:bg-neutral-100'
						/>
					</div>
				}
				handleChangePageSize={handleChangePageSize}
				pageSize={pageSize}
				handleNextPage={handleNextPage}
				handlePrevPage={handlePrevPage}
				handleFirstPage={handleFirstPage}
				handleLastPage={handleLastPage}
				onlyFirstLastPagination={false}
				hideFirstLastPagination={true}
				disabledPagination={{
					first: pageNo === 1,
					prev: pageNo === 1,
					next: isCursorBased ? !hasNextPage : pageNo >= totalPages,
					last: isCursorBased ? !hasNextPage : pageNo >= totalPages,
				}}
				selectPerRowsOptions={[10, 25, 50]}
				remainingWidth='53px'
				paginationWidth='60px'
				remaining={
					statusFilteredOrders.length > 0
						? `${(pageNo - 1) * pageSize + 1} - ${(pageNo - 1) * pageSize + statusFilteredOrders.length}`
						: "0 - 0"
				}
				buttonLabel={
					activeStatus === "Scanned" || activeStatus === "Rec. Return"
						? "Scan"
						: undefined
				}
				onClickButton={() => setScanModal(true)}
				disabledBtn={isScanning}
			>
				{isTableLoader ? (
					<TableRowLoader rowsNum={10} cellsNum={DYNAMIC_HEAD.length + 1} />
				) : statusFilteredOrders.length > 0 ? (
					statusFilteredOrders.map((order: ShopifyRow, idx: number) => {
						const rowKey = `${order.order}-${idx}`;
						const isHovered = hoveredRow === rowKey;
						const isUnfulfilled = order.status === "Unfulfilled";
						return (
							<ShopifyTableRow
								key={order.order || idx}
								order={order}
								index={idx}
								rowKey={rowKey}
								isHovered={isHovered}
								isUnfulfilled={isUnfulfilled}
								showShopColumn={showShopColumn}
								activeNoteRow={activeNoteRow}
								noteIndicatorRef={noteIndicatorRef}
								isRowSelected={isRowSelected}
								toggleRow={toggleRow}
								onMouseEnter={() => setHoveredRow(rowKey)}
								onMouseLeave={() => setHoveredRow(null)}
								onNoteRowClick={setActiveNoteRow}
								onUpdateOrder={() =>
									navigate(`/update-shopify-order/${order.orderId}`, {
										state: { shopId: order.shopId, orderName: order.order },
									})
								}
								onEditNote={() => {
									setActiveNoteRow(null);
									setNoteModal({
										open: true,
										kind: "note",
										rowKey,
										orderNo: order.order,
										customer: order.customer,
										initialValue: order.note || "",
									});
								}}
								onAddNote={() => {
									setNoteModal({
										open: true,
										rowKey,
										orderNo: order.order,
										customer: order.customer,
									});
								}}
								onEditPhone={() => {
									setNoteModal({
										open: true,
										kind: "phone",
										rowKey,
										orderNo: order.order,
										customer: order.customer,
										initialValue: order.phone || "",
									});
								}}
								onEditDestination={() => {
									setAddressModal({
										open: true,
										rowKey,
										orderNo: order.order,
										customer: order.customer,
										initialValue: order.destination,
										initialAddress2: order.address2,
										initialZip: order.zip,
									});
								}}
								onStatusUpdate={clearSelection}
								hiddenColumns={hiddenColumns}
								activeStatus={activeStatus}
							/>
						);
					})
				) : (
					<TableRow>
						<TableCell
							colSpan={DYNAMIC_HEAD.length + 1}
							className='text-center'
						>
							No Orders Found
						</TableCell>
					</TableRow>
				)}
			</CustomTable>

			<AddNoteModal
				open={noteModal.open}
				orderNo={noteModal.orderNo ?? ""}
				customer={noteModal.customer ?? ""}
				initialValue={noteModal.initialValue ?? ""}
				kind={(noteModal.kind as TNoteModalKind) ?? "note"}
				onClose={() => setNoteModal({ open: false, rowKey: "" })}
				onSave={(val) => {
					const orderObj = statusFilteredOrders.find(
						(o) =>
							`${o.order}-${statusFilteredOrders.indexOf(o)}` ===
							noteModal.rowKey,
					);
					const storeId = orderObj?.shopId;
					const orderId = orderObj?.orderId;
					if (!orderObj || !storeId || !orderId) {
						alert("Missing required fields: store_id, order_id, note/address");
						return;
					}
					if (noteModal.kind === "phone") {
						//
					} else {
						updateShopifyOrderNote({
							storeId,
							orderId,
							note: val,
						});
					}
				}}
			/>

			<UpdateAddressModal
				open={addressModal.open}
				orderNo={addressModal.orderNo ?? ""}
				customer={addressModal.customer ?? ""}
				initialValue={addressModal.initialValue ?? ""}
				initialAddress2={addressModal.initialAddress2}
				initialZip={addressModal.initialZip}
				onClose={() => setAddressModal({ open: false, rowKey: "" })}
				onSave={(addressData) => {
					const orderObj = statusFilteredOrders.find(
						(o) =>
							`${o.order}-${statusFilteredOrders.indexOf(o)}` ===
							addressModal.rowKey,
					);
					const storeId = orderObj?.shopId;
					const orderId = orderObj?.orderId;
					if (!orderObj || !storeId || !orderId) {
						toast.error("Missing required fields: store_id, order_id, address");
						return;
					}
					updateShopifyOrderAddress(
						{
							storeId,
							orderId,
							address: addressData,
						},
						{
							onSuccess: () => {
								setAddressModal({ open: false, rowKey: "" });
							},
						},
					);
				}}
			/>

			{scanModal && (
				<ScanModal
					handleCancel={() => setScanModal(false)}
					open={scanModal}
					handleScan={handleScan}
					mode={activeStatus === "Rec. Return" ? "return" : "scan"}
				/>
			)}

			{pdfData && (
				<PackagingSlipPdfGenerator ref={packagingSlipPdfRef} order={pdfData} />
			)}
			{printScannedOrderData && (
				<ScannedOrderPdfGenerator
					ref={scannedOrderPdfRef}
					order={printScannedOrderData}
				/>
			)}
		</Layout>
	);
};
export default Shopify;
