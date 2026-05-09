import { Skeleton } from "../ui/skeleton";
import { TableRow, TableCell } from "../ui/table";

type Props = {
	rowsNum: number;
	cellsNum: number;
};

const TableRowsLoader = ({ rowsNum, cellsNum }: Props) => {
	return [...Array(rowsNum)].map((_, index) => (
		<TableRow key={index} className='h-[40px]'>
			{[...Array(cellsNum)].map((_, index) => (
				<TableCell key={index}>
					<Skeleton className='h-[20px] w-full' />
				</TableCell>
			))}
		</TableRow>
	));
};

export default TableRowsLoader;
