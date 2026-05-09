import React from "react";
import { Message, PencilMinusSvg } from "@/assets/svg";
import AddNoteIndicator from "@/components/custom/add-note-indicator";
import NoteIndicator from "@/components/custom/note-indicator";

interface OrderCellProps {
	order: string;
	note?: string | null;
	isUnfulfilled: boolean;
	isCancelled?: boolean;
	isHovered: boolean;
	isPendingStatus: boolean;
	rowKey: string;
	activeNoteRow: string | null;
	noteIndicatorRef: React.RefObject<HTMLDivElement | null>;
	onNoteRowClick: (rowKey: string) => void;
	onEditNote: () => void;
	onAddNote: () => void;
	onUpdateOrder: () => void;
}

const OrderCell: React.FC<OrderCellProps> = ({
	order,
	note,
	isUnfulfilled,
	isCancelled,
	isHovered,
	rowKey: _rowKey,
	activeNoteRow: _activeNoteRow,
	noteIndicatorRef: _noteIndicatorRef,
	onNoteRowClick: _onNoteRowClick,
	onEditNote,
	onAddNote,
	onUpdateOrder,
	isPendingStatus,
}) => {
	return (
		<div className='flex items-center gap-2'>
			<span
				className={isUnfulfilled || isCancelled ? "line-through" : undefined}
			>
				{order}
			</span>
			{note ? (
				<span className='inline-flex relative cursor-pointer gap-2 group'>
					<img src={Message} className='w-[20px] h-[20px]' alt='WIDE POS' />
					<div className='absolute left-[36px] top-[3px] z-10 hidden group-hover:block'>
						<NoteIndicator note={note} onEdit={onEditNote} />
					</div>

					{isPendingStatus && isHovered && (
						<PencilMinusSvg
							className='cursor-pointer'
							onClick={(e) => {
								e.stopPropagation();
								onUpdateOrder();
							}}
						/>
					)}
				</span>
			) : (
				isHovered && (
					<>
						<button
							type='button'
							className='inline-flex'
							onClick={(e) => {
								e.stopPropagation();
								onAddNote();
							}}
						>
							<AddNoteIndicator active />
						</button>

						{isPendingStatus && (
							<PencilMinusSvg
								className='cursor-pointer'
								onClick={(e) => {
									e.stopPropagation();
									onUpdateOrder();
								}}
							/>
						)}
					</>
				)
			)}
		</div>
	);
};

export default OrderCell;
