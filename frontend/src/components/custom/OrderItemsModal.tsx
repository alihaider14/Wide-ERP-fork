import { ORDER_ITEMS_HEAD_DATA } from "@/constant/tableData";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import SimpleTable from "./SimpleTable";
import { TableCell, TableRow } from "../ui/table";
import { useQuery } from "@tanstack/react-query";
import { OrderService } from "@/services";
import TableRowLoader from "./TableRowLoader";

type TProps = {
	open: boolean;
	handleCancel?: () => void;
	_id?: string;
};

const OrderItemsModal = ({ open, _id, handleCancel }: TProps) => {
	const { data, isLoading } = useQuery({
		queryKey: [`order-items-${_id}`, _id],
		queryFn: () => OrderService.getOrderItemsById(_id),
		enabled: !!_id,
	});

	return (
		<Dialog open={open}>
			<DialogContent
				onClose={handleCancel}
				className='sm:max-w-[600px] max-h-[90vh] p-0 gap-0 overflow-auto border-0 rounded-[5px]'
				aria-describedby={undefined}
				crossIconClassName='top-[10px] right-[10px]'
			>
				<DialogTitle className='h-14 flex items-center justify-center px-4'>
					Order Items
				</DialogTitle>
				<SimpleTable head={ORDER_ITEMS_HEAD_DATA}>
					{isLoading ? (
						<TableRowLoader
							rowsNum={10}
							cellsNum={ORDER_ITEMS_HEAD_DATA.length}
						/>
					) : data && data?.order_items?.length > 0 ? (
						data?.order_items?.map((order_items, index) => (
							<TableRow
								key={index}
								className='cursor-pointer hover:bg-gray-100 last:border-b-0'
							>
								<TableCell className='pl-5 md:pl-10 font-medium'>
									{order_items?.sku || "N/A"}
								</TableCell>

								<TableCell align='center'>
									{order_items?.price || 0} x {order_items?.quantity || 0}
								</TableCell>
								<TableCell align='center'>
									{order_items?.price * order_items?.quantity || 0}
								</TableCell>
							</TableRow>
						))
					) : (
						<TableRow>
							<TableCell
								colSpan={ORDER_ITEMS_HEAD_DATA.length}
								className='text-center'
							>
								No Order Items Found
							</TableCell>
						</TableRow>
					)}
				</SimpleTable>
			</DialogContent>
		</Dialog>
	);
};

export default OrderItemsModal;
