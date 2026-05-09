import { ThreeDotsMenu } from "@/assets/svg";
import React from "react";
import CustomCheckbox from "../components/ui/customCheckboxx";
import type { BulkMenuController } from "@/hooks/useDropdownMenu";
import { TCourierBasic } from "@/types/Courier";
import { COLOR } from "@/constant/Colors";

export type THead = { title: React.ReactNode; className?: string };

export function buildHead(
	selectionActive: boolean,
	selectedCount: number,
	allSelectedOnPage: boolean,
	toggleAllOnPage: () => void,
	dynamicHead: THead[],
	handleMergeOrder: () => void,
	bulkMenu?: BulkMenuController,
	onPrintSelected?: () => void,
	couriers?: TCourierBasic[],
	isSingleShop?: boolean,
	handleBookCourier?: (courier: TCourierBasic) => void,
	printScannedOrders?: () => void,
	onReadyToShip?: () => void,
	activeStatus?: string,
	isReadyToShipPending?: boolean,
): THead[] {
	const MasterCheckbox = (
		<CustomCheckbox
			checked={allSelectedOnPage}
			onChange={toggleAllOnPage}
			indeterminate={selectedCount > 0 && !allSelectedOnPage}
			className='w-5 h-5 rounded relative top-[2.5px] left-[2.5px] opacity-100 accent-primaryDarkBlue rotate-0'
		/>
	);

	if (selectionActive) {
		const itemClass =
			"px-4 py-3 text-[14px] font-[400] leading-[20px] whitespace-nowrap hover:bg-gray-100 cursor-pointer";

		const toolbarRight = (
			<div className='absolute top-1/2 -translate-y-1/2 left-0 flex items-center gap-5 whitespace-nowrap z-10'>
				<span className='text-sm font-medium'>{selectedCount} Selected</span>
				<button
					type='button'
					className='w-18 h-7.5 rounded border border-grey px-5 py-0.75 shadow-[0px_2px_3px_1px_#00000026] flex items-center gap-2 font-medium text-[14px] bg-white cursor-pointer'
					onClick={onPrintSelected}
				>
					Print
				</button>
				{activeStatus === "Pending" && (
					<button
						type='button'
						disabled={isReadyToShipPending}
						className='w-max h-7.5 rounded border border-grey px-5 py-0.75 shadow-[0px_2px_3px_1px_#00000026] flex items-center gap-2 font-medium text-[14px] bg-white cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed'
						onClick={onReadyToShip}
					>
						{isReadyToShipPending ? "Loading..." : "Ready to Ship"}
					</button>
				)}

				{printScannedOrders && (
					<button
						type='button'
						className='w-47.25 h-7.5 rounded border border-grey px-5 py-0.75 shadow-[0px_2px_3px_1px_#00000026] flex items-center gap-2 font-medium text-[14px] bg-white cursor-pointer'
						onClick={printScannedOrders}
					>
						Print Scanned Orders
					</button>
				)}

				<div
					ref={bulkMenu?.ref as React.RefObject<HTMLDivElement>}
					className='relative'
				>
					<button
						type='button'
						aria-label='More actions'
						onClick={bulkMenu?.toggle}
						className='w-10 h-7.5 rounded border border-grey px-2 py-0.5 shadow-[0px_2px_3px_1px_#00000026] flex items-center justify-center bg-white cursor-pointer'
					>
						<ThreeDotsMenu />
					</button>
					{bulkMenu?.open && (
						<div className='absolute right-0 mt-2 w-52 rounded-lg border border-borderColor bg-white z-60 shadow-[0px_6px_12px_rgba(0,0,0,0.15)]'>
							{activeStatus === "Pending" && selectedCount === 2 && (
								<>
									<div
										className={itemClass}
										onClick={() => {
											bulkMenu?.close();
											handleMergeOrder();
										}}
									>
										Merge Orders
									</div>
									<div className='border-b border-borderColor' />
								</>
							)}

							{isSingleShop && couriers && couriers.length > 0 ? (
								couriers.map((courier, idx) => (
									<React.Fragment key={courier.name}>
										<div
											className={itemClass}
											onClick={() => {
												bulkMenu?.close();
												handleBookCourier?.(courier);
											}}
										>
											Book at {courier.name}
										</div>
										{idx !== couriers.length - 1 && (
											<div className='border-b border-borderColor' />
										)}
									</React.Fragment>
								))
							) : (
								<div className='px-4 py-3 text-sm text-gray-400'>
									No couriers found
								</div>
							)}
						</div>
					)}
				</div>
			</div>
		);

		return [
			{ title: MasterCheckbox, className: "ps-6 pe-2 w-auto min-w-0 px-5!" },
			{ title: toolbarRight, className: "relative overflow-visible p-0" },
			...Array(Math.max(0, dynamicHead.length - 1)).fill({
				title: "",
				className: "",
			}),
		];
	}

	return [
		{ title: MasterCheckbox, className: "ps-6 pe-2 w-auto min-w-0 px-5!" },
		...dynamicHead,
	];
}

export function buildAnalyticsHead(
	allRowsSelected: boolean,
	someRowsSelected: boolean,
	handleToggleAll: () => void,
	baseHead: THead[],
): THead[] {
	return [
		{
			title: (
				<CustomCheckbox
					checked={allRowsSelected}
					onChange={handleToggleAll}
					indeterminate={someRowsSelected && !allRowsSelected}
					style={{
						width: 20,
						height: 20,
						borderRadius: 4,
						position: "relative" as const,
						top: 2.5,
						left: 2.5,
						transform: "rotate(0deg)",
						opacity: 1,
						accentColor: COLOR.primaryDarkBlue,
					}}
				/>
			),
			className: "ps-6",
		},
		...baseHead,
	];
}

export function buildProductTableHead(
	selectedCount: number,
	allSelectedOnPage: boolean,
	toggleAllOnPage: () => void,
	dynamicHead: THead[],
	onPrintSelected?: () => void,
): THead[] {
	const MasterCheckbox = (
		<CustomCheckbox
			checked={allSelectedOnPage}
			onChange={toggleAllOnPage}
			indeterminate={selectedCount > 0 && !allSelectedOnPage}
			className='w-5 h-5 rounded relative top-[2.5px] left-[2.5px] opacity-100 accent-blue'
		/>
	);

	if (selectedCount >= 1) {
		const toolbarRight = (
			<div className='absolute top-1/2 -translate-y-1/2 left-0 flex items-center gap-5 whitespace-nowrap z-10'>
				<span className='text-sm font-medium text-semi-black'>
					{selectedCount} Selected
				</span>
				<button
					type='button'
					className='w-18 h-6.75 rounded border border-grey px-5 py-0.75 shadow-[0px_2px_3px_1px_#00000026] flex items-center gap-2 font-medium text-[14px] bg-white cursor-pointer'
					onClick={onPrintSelected}
				>
					Print
				</button>
			</div>
		);

		return [
			{ title: MasterCheckbox, className: "pl-5 md:pl-10 pr-3 min-w-10" },
			{ title: toolbarRight, className: "relative overflow-visible p-0" },
			...Array(Math.max(0, dynamicHead.length - 1)).fill({
				title: "",
				className: "",
			}),
		];
	}

	return [
		{ title: MasterCheckbox, className: "pl-5 md:pl-10 pr-3 min-w-10" },
		...dynamicHead,
	];
}
