import { HISTORY_HEAD_DATA } from "@/constant/tableData";
import { Dialog, DialogContent } from "../ui/dialog";
import SimpleTable from "./SimpleTable";
import { TableCell, TableRow } from "../ui/table";
import { useQuery } from "@tanstack/react-query";
import { AdjustQtyService } from "@/services";
import { DialogTitle } from "@radix-ui/react-dialog";
import { TableRowLoader } from "..";

type TProps = {
	open: boolean;
	handleCancel?: () => void;
	_id?: string;
	count: number;
};

const AdjustmentHistoryModal = ({ open, _id, handleCancel, count }: TProps) => {
	const { data, isLoading } = useQuery({
		queryKey: [`adjustmentHistories/${_id}`, _id],
		queryFn: () => AdjustQtyService.adjustmentHistory(_id),
		enabled: !!_id,
	});

	return (
		<Dialog open={open} onOpenChange={handleCancel}>
			<DialogContent
				onClose={handleCancel}
				className='sm:max-w-[500px] max-h-[70vh] p-0 gap-0 overflow-auto rounded-[5px] border-0'
				aria-describedby={undefined}
				crossIconClassName='top-[10px] right-[10px]'
			>
				<DialogTitle className='hidden'></DialogTitle>

				<SimpleTable head={HISTORY_HEAD_DATA}>
					{isLoading ? (
						<TableRowLoader
							rowsNum={count}
							cellsNum={HISTORY_HEAD_DATA.length}
						/>
					) : data && data?.adjustment_history?.length > 0 ? (
						data?.adjustment_history?.map((item, index) => (
							<TableRow
								key={index}
								className='cursor-pointer hover:bg-gray-100 last:border-b-0'
							>
								<TableCell className='pl-5 py-2 !text-wrap'>{item}</TableCell>
							</TableRow>
						))
					) : (
						<TableRow>
							<TableCell
								colSpan={HISTORY_HEAD_DATA.length}
								className='text-center'
							>
								No History Found
							</TableCell>
						</TableRow>
					)}
				</SimpleTable>
			</DialogContent>
		</Dialog>
	);
};

export default AdjustmentHistoryModal;
