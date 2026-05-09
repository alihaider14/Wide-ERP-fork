import { TReduceQtyLog } from "@/types/ReduceQtyLog";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

type TProps = {
	open: boolean;
	handleCancel?: () => void;
	onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
	data?: Partial<TReduceQtyLog>;
	handleSumbit: () => void;
};

const ReduceQtyModal = ({
	open,
	handleCancel,
	data,
	onChange,
	handleSumbit,
}: TProps) => {
	return (
		<Dialog open={open}>
			<DialogContent
				onClose={handleCancel}
				className='sm:max-w-[400px]  p-0 gap-0 overflow-auto py-[30px] px-[25px] rounded-[5px]'
				aria-describedby={undefined}
				crossIconClassName='top-[20px] right-[20px]'
			>
				<DialogTitle className='text-center text-semi-black'>
					Reduce Quantity
				</DialogTitle>

				<div className='flex flex-col gap-5 my-[30px]'>
					<Input
						placeholder='Reason to reduce quantity'
						name='reason'
						label='Reason'
						onChange={onChange}
						value={data?.reason || ""}
					/>

					<Input
						placeholder='Only accepts -ve numbers'
						name='quantity'
						label='Quantity'
						onChange={onChange}
						value={data?.quantity || ""}
						type='number'
						max={-1}
					/>
				</div>

				<Button onClick={handleSumbit}>Submit</Button>
			</DialogContent>
		</Dialog>
	);
};

export default ReduceQtyModal;
