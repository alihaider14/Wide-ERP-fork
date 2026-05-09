import { PhotoIcon, ShopifyCheckIcon, Trash } from "@/assets/svg";
import {
	CustomAutocomplete,
	CustomCheckBox,
	CustomLoader,
	Layout,
	SearchShopifyProduct,
	SimpleTable,
	TableIcon,
	TableRowLoader,
} from "@/components";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableCell, TableRow } from "@/components/ui/table";
import { SHOPIFY_PRODUCT_DATA } from "@/constant/tableData";
import useMergeShopifyOrders from "@/hooks/useMergeShopifyOrders";
import countriesData from "@/constant/Countries.json";
import { CITIES } from "@/constant/cities";
import toast from "react-hot-toast";
import { numberFormateToLocalString } from "../../helper/number-formator";

const MergeShopifyOrders = () => {
	const {
		orderName,
		navigate,
		isLoading,
		orders,
		mergedData,
		customerData,
		selectedCustomer,
		setSelectedCustomer,
		handleProductChange,
		handleDeleteProduct,
		handleAddProduct,
		handleMergedChange,
		handleStatusChange,
		handleCustomerChange,
		handleCustomerFieldSelect,
		productTotalAmount,
		totalAmount,
		handleMergeOrders,
		shopId,
		disabledSubmitButton,
	} = useMergeShopifyOrders();

	return (
		<Layout
			headerTitle={`Merge Orders: ${orderName.join(", ")}`}
			buttonLabel='Shopify'
			buttonLink='/shopify'
			mainLayoutContainerClassName='!p-0'
		>
			<CustomLoader isLoading={isLoading} />

			<div className='flex flex-col h-[calc(100vh-50px)]'>
				<div className='p-5 md:p-10 flex-1 min-h-0 overflow-y-auto flex flex-col gap-5 bg-secondary-grey'>
					<div className='w-full bg-white border border-border rounded-[5px] max-w-[810px]'>
						<SearchShopifyProduct
							shopId={shopId}
							handleAddProduct={handleAddProduct}
						/>

						<SimpleTable
							head={SHOPIFY_PRODUCT_DATA}
							rowClassName='border-t-0'
							headerRowHeight='50px'
							bodyRowHeight='50px'
						>
							{isLoading ? (
								<TableRowLoader
									rowsNum={5}
									cellsNum={SHOPIFY_PRODUCT_DATA.length}
								/>
							) : mergedData?.product && mergedData.product.length > 0 ? (
								mergedData.product.map((item, index) => (
									<TableRow
										key={item.sku}
										className='cursor-pointer hover:bg-gray-100 h-[50px]'
									>
										<TableCell className='font-medium text-sm text-semi-black pl-5 md:pl-10 whitespace-normal text-wrap'>
											<div className='flex flex-row items-center gap-2'>
												<div className='bg-secondary-grey min-w-10 size-10 rounded border border-borderColor flex items-center justify-center'>
													{item?.image ? (
														<img
															src={item.image as string}
															alt={item.name}
															width={40}
															height={40}
															className='object-cover size-full rounded'
														/>
													) : (
														<PhotoIcon width={20} height={20} />
													)}
												</div>
												<span className='wrap-break-word'>
													{item.name || item.sku}
												</span>
											</div>
										</TableCell>

										<TableCell className='font-medium'>
											{item.sku || "N/A"}
										</TableCell>

										<TableCell>
											<Input
												placeholder='e.g 10'
												name='price'
												type='number'
												min={0}
												value={item.price || ""}
												onChange={(e) => {
													const price = Number(e.target.value) || 0;
													if (
														item.actualPrice &&
														price > Number(item.actualPrice || 0)
													) {
														toast.error(
															`${item.sku} price can't exceed ${item.actualPrice}.`,
														);
													} else {
														handleProductChange(index, e.target.value, "price");
													}
												}}
												className='h-[30px] border border-borderColor rounded-[3px] placeholder:text-grey text-sm font-normal px-2 py-[5px]'
											/>
										</TableCell>

										<TableCell>
											<Input
												placeholder='Qty'
												name='qty'
												type='number'
												min={0}
												value={item.qty || ""}
												onChange={(e) => {
													const qty = Number(e.target.value) || 0;
													if (item.actualQty && qty > item.actualQty) {
														toast.error(
															`${item.sku} has only ${item.actualQty} units available.`,
														);
													} else {
														handleProductChange(index, e.target.value, "qty");
													}
												}}
												className='h-[30px] border border-borderColor rounded-[3px] placeholder:text-grey text-sm font-normal px-2 py-[5px]'
											/>
										</TableCell>

										<TableCell className='h-[60px] pr-5 md:pr-10'>
											<TableIcon
												src={Trash}
												alt='Trash'
												tooltipId='delete-tooltip'
												data-tooltip-content='Delete'
												className='bg-light-red'
												onClick={() => handleDeleteProduct(index)}
											/>
										</TableCell>
									</TableRow>
								))
							) : (
								<TableRow>
									<TableCell
										colSpan={SHOPIFY_PRODUCT_DATA.length}
										className='text-center font-medium'
									>
										No Products Selected Yet
									</TableCell>
								</TableRow>
							)}
						</SimpleTable>

						<div className='flex items-center justify-between px-5 md:px-10 py-3 min-h-[50px]'>
							<span className='text-semi-black text-sm'>
								Subtotal: Rs.{" "}
								{numberFormateToLocalString(productTotalAmount || 0)}
							</span>
						</div>
					</div>

					<div className='w-full bg-white border border-border rounded-[5px] max-w-[810px] p-5 gap-5 grid md:grid-cols-2'>
						<Input
							placeholder='e.g 300 or 10%'
							name='discount'
							onChange={(e) => {
								if (/^\d*%?$/.test(e.target.value)) handleMergedChange(e);
							}}
							onKeyDown={(e) => {
								if (e.key === "-") e.preventDefault();
							}}
							value={mergedData?.discount || ""}
							label='Discount (Rs.)'
							required
							min={0}
						/>

						<Input
							placeholder='e.g 100'
							label='Delivery Charges (Rs.)'
							name='deliveryCharges'
							value={mergedData?.deliveryCharges || ""}
							required
							type='number'
							min={0}
							onChange={(e) => {
								if (/^\d*\.?\d*$/.test(e.target.value)) handleMergedChange(e);
							}}
							onKeyDown={(e) => {
								if (e.key === "-") e.preventDefault();
							}}
						/>

						<CustomCheckBox
							checked={mergedData.status === "Paid"}
							handleCheck={(checked) => handleStatusChange(!checked)}
							label='Mark as paid — customer will pay 0 COD.'
							name='status'
							containerClassName='gap-2 md:col-span-2'
						/>
					</div>

					{orders?.map((order) => {
						const isSelected = selectedCustomer === order.orderId;

						const customerFields = customerData[order.orderId];

						return (
							<div
								className={`w-full border rounded-[5px] max-w-[810px] p-5 gap-5 relative  grid md:grid-cols-2 bg-white transition-colors duration-200 ${
									isSelected ? "" : " opacity-70"
								}`}
								key={order.orderId}
							>
								{/* Card Header */}

								<CustomCheckBox
									checked={isSelected}
									handleCheck={() => setSelectedCustomer(order.orderId)}
									name={`select-customer-${order.orderId}`}
									containerClassName='absolute right-2 top-2'
									className='size-5 rounded-full data-[state=checked]:bg-transparent data-[state=checked]:border-none border-grey border-2'
									checkIcon={ShopifyCheckIcon}
									iconHeight={20}
									iconWidth={20}
								/>

								{/* Customer Fields */}
								<Input
									placeholder='e.g John Doe'
									name='customerName'
									onChange={(e) => handleCustomerChange(order.orderId, e)}
									value={customerFields?.customerName || ""}
									label='Customer'
									required
									disabled={!isSelected}
								/>

								<Input
									placeholder='e.g 03311234567'
									label='Phone'
									name='phoneNo'
									onChange={(e) => handleCustomerChange(order.orderId, e)}
									value={customerFields?.phoneNo || ""}
									required
									type='number'
									disabled={!isSelected}
								/>

								<Input
									placeholder='e.g 31/465, street #3, Green Wood Street'
									label='Address'
									name='address'
									onChange={(e) => handleCustomerChange(order.orderId, e)}
									value={customerFields?.address || ""}
									required
									containerClassName='md:col-span-2'
									disabled={!isSelected}
								/>

								<Input
									placeholder='Apartment, suite, etc'
									label='Apartment, suite, etc'
									name='apartmentSuit'
									onChange={(e) => handleCustomerChange(order.orderId, e)}
									value={customerFields?.apartmentSuit || ""}
									disabled={!isSelected}
								/>

								<Input
									placeholder='Postal Code'
									label='Postal Code'
									name='postalCode'
									onChange={(e) => handleCustomerChange(order.orderId, e)}
									value={customerFields?.postalCode || ""}
									type='number'
									disabled={!isSelected}
								/>

								<CustomAutocomplete
									data={CITIES.map((c) => ({ ...c }))}
									placeholder='City'
									label='City'
									name='city'
									value={customerFields?.city || ""}
									onChange={(e) => handleCustomerChange(order.orderId, e)}
									handleSelect={(item) =>
										handleCustomerFieldSelect(order.orderId, "city", item.name)
									}
									required
									disabled={!isSelected}
								/>

								<CustomAutocomplete
									data={countriesData.map((c) => ({
										name: c.country,
										id: c.country,
									}))}
									placeholder='Country'
									label='Country'
									name='country'
									value={customerFields?.country || ""}
									onChange={(e) => handleCustomerChange(order.orderId, e)}
									handleSelect={(item) =>
										handleCustomerFieldSelect(
											order.orderId,
											"country",
											item.name,
										)
									}
									required
									disabled={!isSelected}
								/>
							</div>
						);
					})}

					<div className='w-full bg-white border border-border rounded-[5px] max-w-[810px] p-5 gap-5 grid md:grid-cols-2'>
						<Input
							placeholder='Note'
							label='Note'
							name='note'
							onChange={handleMergedChange}
							value={mergedData?.note || ""}
							containerClassName='md:col-span-2'
						/>
						<Input
							placeholder='Shipper Remarks'
							label='Shipper Remarks'
							name='shippingRemarks'
							onChange={handleMergedChange}
							value={mergedData?.shippingRemarks || ""}
							containerClassName='md:col-span-2'
						/>
					</div>
				</div>

				<div className='shrink-0 bg-grey-100 min-h-[60px] py-3 px-5 gap-5 lg:px-10 flex flex-col lg:flex-row justify-between items-center border-t border-borderColor sticky bottom-0'>
					<span className='font-normal text-semi-black text-nowrap'>
						Customer will pay:
						<span className='font-semibold'>
							{" "}
							Rs. {numberFormateToLocalString(totalAmount || 0)}
						</span>
					</span>

					<div className='flex flex-col lg:flex-row lg:items-center gap-5 w-full lg:justify-end'>
						<Button
							variant='secondary'
							className='w-full lg:max-w-[129px] bg-secondary-grey'
							onClick={() => navigate("/shopify")}
						>
							Cancel
						</Button>
						<Button
							variant='primary'
							className='w-full lg:max-w-[129px]'
							onClick={handleMergeOrders}
							disabled={disabledSubmitButton}
						>
							Submit
						</Button>
					</div>
				</div>
			</div>
		</Layout>
	);
};

export default MergeShopifyOrders;
