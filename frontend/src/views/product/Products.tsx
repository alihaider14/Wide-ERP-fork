import { useState } from "react";
import {
	AddQty,
	Barcode,
	Edit,
	PencilPlusIcon,
	PhotoIcon,
	Trash,
} from "@/assets/svg";
import {
	Layout,
	TableIcon,
	TableRowLoader,
	CustomLoader,
	ImportProductModal,
	ProductTable,
	ImportProductQtyModal,
} from "@/components";
import PrintProductModal from "@/components/custom/PrintProductModal";
import SyncShopifyModal from "@/components/custom/SyncShopifyModal";
import CustomCheckbox from "@/components/ui/customCheckboxx";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { TableCell, TableRow } from "@/components/ui/table";
import { ACCESS } from "@/constant/Checkbox";
import { PRODUCT_HEAD_DATA } from "@/constant/tableData";
import { numberFormateToLocalString } from "@/helper/number-formator";
import useAccessStore from "@/hooks/useAccessStore";
import useProduct from "@/hooks/useProduct";
import { useNavigate } from "react-router-dom";

const Products = () => {
	const navigate = useNavigate();
	const hasAccess = useAccessStore((state) => state.hasAccess);
	const [previewImage, setPreviewImage] = useState<{
		open: boolean;
		src: string;
		sku: string;
	}>({ open: false, src: "", sku: "" });

	const {
		isLoading,
		data,
		pageNo,
		pageSize,
		sortBy,
		sortOrder,
		handleSort,
		search,
		loading,
		deleteProductMutation,
		isPaginationData,
		isImportProductModalOpen,
		isImportQtyModalOpen,
		isSyncShopifyModalOpen,
		PRODUCT_DYNAMIC_HEAD_DATA,
		printProductModalData,
		handleNextPage,
		handlePrevPage,
		handleLastPage,
		handleChangePageSize,
		setSearch,
		handleDeleteProduct,
		handleFirstPage,
		setIsImportProductModalOpen,
		setImportQtyModalOpen,
		setIsSyncShopifyModalOpen,
		handleUploadProducts,
		handleSyncShopify,
		handleFilters,
		handleReset,
		handleUploadProductsQuantities,
		isRowSelected,
		toggleRow,
		setPrintProductModalData,
	} = useProduct();

	return (
		<Layout headerTitle='Products'>
			<CustomLoader isLoading={loading || deleteProductMutation.isPending} />

			<ImportProductModal
				open={isImportProductModalOpen}
				handleCancel={() => setIsImportProductModalOpen(false)}
				handleSubmit={handleUploadProducts}
			/>

			<ImportProductQtyModal
				open={isImportQtyModalOpen}
				handleCancel={() => setImportQtyModalOpen(false)}
				handleSubmit={handleUploadProductsQuantities}
			/>

			<SyncShopifyModal
				open={isSyncShopifyModalOpen}
				handleCancel={() => setIsSyncShopifyModalOpen(false)}
				handleSubmit={handleSyncShopify}
			/>

			<PrintProductModal
				open={printProductModalData.open}
				handleCancel={() =>
					setPrintProductModalData({
						open: false,
						data: [],
					})
				}
				products={printProductModalData.data}
			/>

			{/* Image Preview Modal */}
			<Dialog
				open={previewImage.open}
				onOpenChange={(isOpen) =>
					!isOpen && setPreviewImage({ open: false, src: "", sku: "" })
				}
			>
				<DialogContent
					className='sm:max-w-105 rounded-[5px] p-5 gap-4'
					onClose={() => setPreviewImage({ open: false, src: "", sku: "" })}
				>
					<DialogHeader className="overflow-hidden w-full">
						<DialogTitle className='text-sm text-left truncate pr-6 w-full max-w-full'>
							{previewImage.sku}
						</DialogTitle>
					</DialogHeader>

					<div className='flex items-center justify-center rounded-lg bg-secondary-grey border border-borderColor overflow-hidden min-h-75'>
						<img
							src={previewImage.src}
							alt={previewImage.sku}
							className='max-h-100 max-w-full object-contain'
						/>
					</div>
				</DialogContent>
			</Dialog>

			<ProductTable
				head={PRODUCT_DYNAMIC_HEAD_DATA}
				sortBy={sortBy}
				sortOrder={sortOrder}
				onSort={handleSort}
				onClickAddProduct={() => navigate("/add-product")}
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
				onClickImportProduct={() => setIsImportProductModalOpen(true)}
				onClickImportProductQuantites={() => setImportQtyModalOpen(true)}
				onClickSyncShopify={() => setIsSyncShopifyModalOpen(true)}
				disabledBtns={{
					addProduct: !hasAccess(ACCESS.create_product),
					importProduct: !hasAccess(ACCESS.create_product),
					importProductQuantities: !hasAccess(ACCESS.adjust_quantity),
					syncShopify: !hasAccess(ACCESS.sync_products),
				}}
				kpisData={{
					products_count: data?.products_count
						? numberFormateToLocalString(Number(data?.products_count))
						: "0",
					items: data?.items
						? numberFormateToLocalString(Number(data?.items))
						: "0",
					low_stock_items: data?.low_stock_items
						? numberFormateToLocalString(Number(data?.low_stock_items))
						: "0",
					sold_out: data?.sold_out
						? numberFormateToLocalString(Number(data?.sold_out))
						: "0",
				}}
				handleFilters={handleFilters}
				handleReset={handleReset}
			>
				{isLoading || loading ? (
					<TableRowLoader
						rowsNum={10}
						cellsNum={PRODUCT_HEAD_DATA.length + 1}
					/>
				) : data && data?.products?.length > 0 ? (
					data?.products?.map((product) => {
						return (
							<TableRow key={product?._id} className='group'>
								<TableCell className='pl-5 md:pl-10 pr-3'>
									<CustomCheckbox
										checked={isRowSelected(product._id)}
										onChange={() => toggleRow(product._id)}
										className='w-5 h-5 rounded relative opacity-100 accent-blue'
									/>
								</TableCell>

								<TableCell className='font-medium'>
									<div className='flex flex-row items-center gap-3'>
										<div
											className={`bg-secondary-grey size-10 rounded border border-borderColor flex items-center justify-center ${product?.image ? "cursor-pointer" : ""}`}
											onClick={() => {
												if (product?.image) {
													setPreviewImage({
														open: true,
														src: product.image as string,
														sku: product?.sku || "",
													});
												}
											}}
										>
											{product?.image ? (
												<img
													src={product?.image as string}
													alt={product?.name}
													width={40}
													height={40}
													className='object-cover size-full rounded'
												/>
											) : (
												<PhotoIcon width={20} height={20} />
											)}
										</div>

										<span>{product?.name || product?.sku}</span>
									</div>
								</TableCell>

								<TableCell className='font-medium'>
									{product?.sku || "N/A"}
								</TableCell>
								<TableCell>{product?.barcode || "N/A"}</TableCell>
								<TableCell>
									{numberFormateToLocalString(Number(product?.price)) || 0}
								</TableCell>
								<TableCell>
									<button
										className='flex items-center gap-2.5 cursor-pointer'
										onClick={() => {
											navigate("/add-quantity", {
												state: { product },
											});
										}}
									>
										{numberFormateToLocalString(Number(product?.qty)) || 0}

										<img
											src={PencilPlusIcon}
											alt='PencilPlusIcon'
											width={20}
											height={20}
											className='group-hover:visible group-hover:opacity-100 invisible transition-all duration-300 opacity-0'
										/>
									</button>
								</TableCell>
								<TableCell className='pr-5 md:pr-10'>
									<div className='flex items-center justify-center gap-3'>
										<TableIcon
											src={Edit}
											alt='edit'
											tooltipId='edit-tooltip'
											data-tooltip-content='Edit'
											disabledBtn={!hasAccess(ACCESS.update_product)}
											className='bg-grey-100'
											onClick={() =>
												navigate(`/update-product/${product?._id}`)
											}
										/>

										<TableIcon
											src={Barcode}
											alt='Barcode'
											tooltipId='print-barcode-tooltip'
											data-tooltip-content='Print Barcode'
											className='bg-light-blue'
											onClick={() =>
												navigate(`/print-barcode`, {
													state: { product },
												})
											}
										/>

										<TableIcon
											src={AddQty}
											alt='AddQty'
											tooltipId='addQty-tooltip'
											data-tooltip-content='Add Quantity'
											className='bg-light-purple'
											disabledBtn={!hasAccess(ACCESS.adjust_quantity)}
											onClick={() =>
												navigate(`/adjust-quantities/${product?._id}`)
											}
										/>

										<TableIcon
											src={Trash}
											alt='Trash'
											tooltipId='delete-tooltip'
											data-tooltip-content='Delete'
											disabledBtn={!hasAccess(ACCESS.delete_product)}
											className='bg-light-red'
											onClick={() => handleDeleteProduct(product?._id)}
										/>
									</div>
								</TableCell>
							</TableRow>
						);
					})
				) : (
					<TableRow>
						<TableCell
							colSpan={PRODUCT_HEAD_DATA.length + 1}
							className='text-center'
						>
							No Products Found
						</TableCell>
					</TableRow>
				)}
			</ProductTable>
		</Layout>
	);
};

export default Products;