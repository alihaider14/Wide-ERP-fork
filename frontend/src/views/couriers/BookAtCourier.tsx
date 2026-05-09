import { Layout } from "@/components";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CustomCheckbox from "@/components/ui/customCheckboxx";
import CustomAutocomplete, {
	TAutocomplete,
} from "@/components/custom/CustomAutocomplete";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { SHIPMENT_TYPES } from "@/constant/couriers";
import { RemarksSvg, CircleCheck } from "@/assets/svg";
import useBookAtCourier from "@/hooks/useBookAtCourier";

const BookAtCourier = () => {
	const {
		courier,
		rows,
		cities,
		citiesLoading,
		remarksModal,
		setRemarksModal,
		openRemarksModal,
		handleSaveRemarks,
		selectedCount,
		allSelected,
		someSelected,
		toggleAll,
		toggleRow,
		updateRow,
		handleUploadBooking,
		isBookingPending,
	} = useBookAtCourier();

	return (
		<Layout
			headerTitle={`Book at ${courier?.name}`}
			buttonLabel='Shopify'
			buttonLink='/shopify'
			mainLayoutContainerClassName='!p-0 flex flex-col'
		>
			<Dialog
				open={remarksModal.open}
				onOpenChange={(isOpen) =>
					!isOpen &&
					setRemarksModal({ open: false, rowId: "", orderId: "", value: "" })
				}
			>
				<DialogContent
					className='sm:max-w-100 rounded-[5px] p-5 gap-4 overflow-hidden'
					onClose={() =>
						setRemarksModal({ open: false, rowId: "", orderId: "", value: "" })
					}
				>
					<DialogHeader>
						<DialogTitle className='text-sm text-left'>
							Remarks to{" "}
							<span className='font-semibold'>{remarksModal.orderId}</span>
						</DialogTitle>
					</DialogHeader>
					<textarea
						value={remarksModal.value}
						onChange={(e) =>
							setRemarksModal((prev) => ({ ...prev, value: e.target.value }))
						}
						placeholder='Remarks'
						rows={8}
						className='w-full resize-none rounded-lg border border-borderColor px-3 py-2 text-sm text-semi-black placeholder:text-grey focus:outline-none focus:ring-1 focus:ring-borderColor'
					/>
					<Button className='w-full' onClick={handleSaveRemarks}>
						Update Remarks
					</Button>
				</DialogContent>
			</Dialog>

			<div className='flex flex-col h-[calc(100vh-50px)]'>
				<div className='flex-1 overflow-auto p-5 md:p-10'>
					<div className='w-full border border-borderColor rounded-sm overflow-hidden'>
						<Table>
							<TableHeader>
								<TableRow className='w-full  border-b border-borderColor bg-secondary-grey opacity-100  justify-between items-center gap-1'>
									<TableHead className='pl-5 w-auto min-w-0! pr-2'>
										<CustomCheckbox
											checked={allSelected}
											indeterminate={someSelected}
											onChange={toggleAll}
											className='w-5 h-5 rounded-lg relative top-[2.5px] left-[2.5px] opacity-100 accent-blue'
										/>
									</TableHead>
									<TableHead className='min-w-10  px-0'>Sr#</TableHead>
									<TableHead className='min-w-0 px-1'>Order</TableHead>
									<TableHead className='min-w-0 px-0'>Name</TableHead>
									<TableHead className='min-w-0 px-1 '>Phone</TableHead>
									<TableHead className='min-w-0 px-0'>Address</TableHead>
									<TableHead className='min-w-0 px-1'>City</TableHead>
									<TableHead className='min-w-0 px-0'></TableHead>
									<TableHead className='min-w-0 px-1'>COD</TableHead>
									<TableHead className='min-w-0 px-0'>KG</TableHead>
									<TableHead className='min-w-0 px-1'>Type</TableHead>
									<TableHead className='min-w-0 pl-0 pr-5'>More</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody className='bg-white'>
								{rows.map((row, idx) => (
									<TableRow
										key={row.id}
										className='[&>td]:border-b [&>td]:border-borderColor last:[&>td]:border-0 '
									>
										<TableCell className='pl-5 w-auto min-w-0! pr-2 '>
											<CustomCheckbox
												checked={row.selected}
												onChange={() => toggleRow(row.id)}
												className='w-5 h-5 rounded-lg relative top-[2.5px] left-[2.5px] opacity-100 accent-blue'
											/>
										</TableCell>
										<TableCell className='text-sm text-grey min-w-10  px-0 '>
											{idx + 1}
										</TableCell>
										<TableCell className='whitespace-nowrap min-w-0 px-1'>
											{row.order}
										</TableCell>
										<TableCell className='min-w-0 px-0'>
											<Input
												value={row.name}
												onChange={(e) =>
													updateRow(row.id, "name", e.target.value)
												}
												className='min-w-35 h-7.5 text-sm px-2'
											/>
										</TableCell>
										<TableCell className='min-w-0 px-1'>
											<Input
												value={row.phone}
												onChange={(e) =>
													updateRow(row.id, "phone", e.target.value)
												}
												className='min-w-25 h-8 text-sm px-2'
											/>
										</TableCell>
										<TableCell className='min-w-0 px-0'>
											<Input
												value={row.address}
												onChange={(e) =>
													updateRow(row.id, "address", e.target.value)
												}
												className='min-w-62.5 h-8 text-sm px-2'
											/>
										</TableCell>
										<TableCell className='whitespace-nowrap min-w-0 px-1'>
											{row.city}
										</TableCell>
										<TableCell className=' min-w-0 px-0'>
											<CustomAutocomplete
												data={cities as TAutocomplete[]}
												value={row.city}
												handleSelect={(item) =>
													updateRow(row.id, "city", item.name)
												}
												onClear={() => updateRow(row.id, "city", "")}
												placeholder={
													citiesLoading ? "Loading cities..." : "Select City"
												}
												className='min-w-[120px] h-8 text-sm'
												dropdownClassName='rounded-[4px] border-borderColor p-0 gap-0 min-w-[120px] w-full'
												itemClassName='border-b-[0.5px] border-borderColor/50 p-2 rounded-none last:border-b-0 hover:bg-neutral-100 text-sm'
											/>
										</TableCell>
										<TableCell className='min-w-0 px-1'>
											<Input
												value={row.cod}
												onChange={(e) =>
													updateRow(row.id, "cod", e.target.value)
												}
												className='min-w-20 h-8 text-sm px-2'
											/>
										</TableCell>
										<TableCell className='min-w-0 px-0'>
											<Input
												value={row.kg}
												onChange={(e) =>
													updateRow(row.id, "kg", e.target.value)
												}
												className='min-w-10 h-8 text-sm px-2'
											/>
										</TableCell>
										<TableCell className='min-w-0 px-1'>
											<CustomAutocomplete
												data={SHIPMENT_TYPES}
												value={row.type}
												handleSelect={(item) =>
													updateRow(row.id, "type", item.id)
												}
												placeholder='Type'
												className='min-w-20 h-8 text-sm'
												dropdownClassName='rounded-[4px] border-borderColor p-0 gap-0 min-w-20'
												itemClassName='border-b-[0.5px] border-borderColor/50 p-2 rounded-none last:border-b-0 hover:bg-neutral-100 text-sm'
											/>
										</TableCell>
										<TableCell className='min-w-0 pl-0 pr-5'>
											<div className='flex items-center gap-1'>
												<button
													className='w-7 h-7 flex items-center justify-center rounded cursor-pointer'
													title='Remarks'
													onClick={() => openRemarksModal(row)}
												>
													<RemarksSvg />
												</button>
												<button
													className='w-7 h-7 flex items-center justify-center rounded-full cursor-pointer'
													title='Confirm'
												>
													<CircleCheck />
												</button>
											</div>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				</div>

				<div className='flex items-center justify-between px-6 py-4 border-t border-borderColor bg-white sticky w-full z-10'>
					<span className='text-sm font-medium text-semi-black'>
						{selectedCount} orders selected
					</span>
					<Button
						onClick={handleUploadBooking}
						disabled={selectedCount === 0 || isBookingPending}
						className='h-9 px-6'
					>
						{isBookingPending ? "Booking..." : "Upload Booking"}
					</Button>
				</div>
			</div>
		</Layout>
	);
};

export default BookAtCourier;
