import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import CustomCheckbox from "@/components/ui/customCheckboxx";
import OrderCell from "@/components/custom/OrderCell";
import CustomerCell from "@/components/custom/CustomerCell";
import TotalCell from "@/components/custom/TotalCell";
import StatusCell from "@/components/custom/StatusCell";
import TrackingCell from "@/components/custom/TrackingCell";
import DestinationCell from "@/components/custom/DestinationCell";
import type { ShopifyRow } from "@/types/shopify";
import StatusSelect from "@/components/custom/StatusSelect";
import { getComputedStatus } from "@/helper/shopify-utils";

interface ShopifyTableRowProps {
	order: ShopifyRow;
	index: number;
	rowKey: string;
	isHovered: boolean;
	isUnfulfilled: boolean;
	showShopColumn: boolean;
	activeNoteRow: string | null;
	noteIndicatorRef: React.RefObject<HTMLDivElement | null>;
	hiddenColumns: Set<string>;
	activeStatus: string;
	isRowSelected: (key: string) => boolean;
	toggleRow: (key: string) => void;
	onMouseEnter: () => void;
	onMouseLeave: () => void;
	onNoteRowClick: (rowKey: string) => void;
	onEditNote: () => void;
	onAddNote: () => void;
	onUpdateOrder: () => void;
	onEditPhone: () => void;
	onEditDestination: () => void;
	onStatusUpdate: () => void;
}

const ShopifyTableRow: React.FC<ShopifyTableRowProps> = ({
	order,
	index,
	rowKey,
	isHovered,
	isUnfulfilled,
	showShopColumn,
	activeNoteRow,
	noteIndicatorRef,
	isRowSelected,
	toggleRow,
	onMouseEnter,
	onMouseLeave,
	onNoteRowClick,
	onEditNote,
	onAddNote,
	onEditPhone,
	onEditDestination,
	onStatusUpdate,
	hiddenColumns,
	activeStatus,
	onUpdateOrder,
}) => {
	const status = getComputedStatus(order.wd_status, order.delivery_status);

	const isCancelled = status === "Cancelled";

	return (
		<TableRow
			key={order.order || index}
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
			className={`${isUnfulfilled ? "opacity-50" : ""} ${
				isCancelled ? "text-grey" : ""
			} [&>td]:border-b [&>td]:border-offWhite`}
		>
			<TableCell className='ps-6 pe-2 w-auto min-w-0 px-5!'>
				<CustomCheckbox
					checked={isRowSelected(rowKey)}
					onChange={() => toggleRow(rowKey)}
					className='w-5 h-5 rounded-lg relative top-[2.5px] left-[2.5px] rotate-0 opacity-100 accent-primaryDarkBlue'
				/>
			</TableCell>

			<TableCell className='whitespace-nowrap'>
				<OrderCell
					order={order.order}
					note={order.note}
					isUnfulfilled={isUnfulfilled}
					isCancelled={isCancelled}
					isHovered={isHovered}
					rowKey={rowKey}
					activeNoteRow={activeNoteRow}
					noteIndicatorRef={noteIndicatorRef}
					onNoteRowClick={onNoteRowClick}
					onEditNote={onEditNote}
					onAddNote={onAddNote}
					onUpdateOrder={onUpdateOrder}
					isPendingStatus={status === "Pending"}
				/>
			</TableCell>

			{showShopColumn && (
				<TableCell
					className={isUnfulfilled || isCancelled ? "line-through" : undefined}
				>
					{order.shop || "N/A"}
				</TableCell>
			)}

			<TableCell
				className={isUnfulfilled || isCancelled ? "line-through" : undefined}
			>
				{order.date}
			</TableCell>

			<TableCell className='max-w-50'>
				<CustomerCell
					customer={order.customer}
					phone={order.phone}
					isUnfulfilled={isUnfulfilled}
					isCancelled={isCancelled}
					isHovered={isHovered}
					onHoverEnter={onMouseEnter}
					onHoverLeave={onMouseLeave}
					onEditPhone={onEditPhone}
				/>
			</TableCell>

			<TableCell>
				<TotalCell
					total={order.total}
					totalPrice={order.totalPrice}
					items={order.items}
					isUnfulfilled={isUnfulfilled}
					isCancelled={isCancelled}
				/>
			</TableCell>

			{!hiddenColumns.has("Printed") && (
				<TableCell className='text-center'>
					{order.printed_count || 0}
				</TableCell>
			)}

			<TableCell>
				<StatusSelect
					status={status}
					order={order}
					activeStatus={activeStatus}
					onChange={() => {
						onStatusUpdate();
					}}
				/>
			</TableCell>

			{!hiddenColumns.has("Ful. Status") && (
				<TableCell>
					<StatusCell status={order.status} />
				</TableCell>
			)}

			{!hiddenColumns.has("Tracking") && (
				<TableCell>
					<TrackingCell
						trackingReference={order.trackingReference}
						tracking={order.tracking}
						isUnfulfilled={isUnfulfilled}
						isCancelled={isCancelled}
						isHovered={isHovered}
					/>
				</TableCell>
			)}

			<TableCell>
				<DestinationCell
					destination={order.destination}
					isUnfulfilled={isUnfulfilled}
					isCancelled={isCancelled}
					isHovered={isHovered}
					onHoverEnter={onMouseEnter}
					onHoverLeave={onMouseLeave}
					onEdit={onEditDestination}
				/>
			</TableCell>
		</TableRow>
	);
};

export default ShopifyTableRow;
