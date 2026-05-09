import { HISTORY_HEAD_DATA } from "@/constant/tableData";
import { Dialog, DialogContent } from "../ui/dialog";
import SimpleTable from "./SimpleTable";
import { TableCell, TableRow } from "../ui/table";
import { useQuery } from "@tanstack/react-query";
import { OrderService } from "@/services";
import { DialogTitle } from "@radix-ui/react-dialog";
import { TableRowLoader } from "..";

type TProps = {
	open: boolean;
	handleCancel?: () => void;
	_id?: string;
	order_no: number;
};

const OrderLogHistoryModal = ({
	open,
	_id,
	handleCancel,
	order_no,
}: TProps) => {
	const { data, isLoading } = useQuery({
		queryKey: [`orderLogsHistory/${_id}`, _id],
		queryFn: () => OrderService.getOrderLogsHistory(_id),
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

				<SimpleTable
					head={[{ title: `Order Logs - ${order_no}`, className: "pl-5" }]}
				>
					{isLoading ? (
						<TableRowLoader
							rowsNum={Math.floor(Math.random() * (7 - 3 + 1))}
							cellsNum={HISTORY_HEAD_DATA.length}
						/>
					) : data && data?.order_logs_history?.length > 0 ? (
						data?.order_logs_history?.map((item, index) => (
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

export default OrderLogHistoryModal;
