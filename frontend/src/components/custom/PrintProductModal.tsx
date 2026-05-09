import { PRINT_PRODUCT_HEAD_DATA } from "@/constant/tableData";
import { Dialog, DialogContent } from "../ui/dialog";
import SimpleTable from "./SimpleTable";
import { TableCell, TableRow } from "../ui/table";
import { DialogTitle } from "@radix-ui/react-dialog";
import { TPrintProducts } from "@/types/Products";
import { CloseIcon, PhotoIcon, TrashIconDefault } from "@/assets/svg";
import { Input } from "../ui/input";
import { PDFGeneratorHandle } from "@/types/pdf";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import ProductPdfGenerator from "./ProductPdfGenerator";
import { Button } from "../ui/button";

type TPrintProductRow = TPrintProducts;

type TProps = {
	open: boolean;
	handleCancel?: () => void;
	products: Partial<TPrintProducts>[];
};

const PrintProductModal = ({ open, handleCancel, products }: TProps) => {
	const printPdfRef = useRef<PDFGeneratorHandle>(null);
	const [data, setData] = useState<TPrintProductRow[] | null>(null);

	useEffect(() => {
		if (open) setData(products as TPrintProducts[]);
	}, [open, products]);

	useEffect(() => {
		if (data && data.length === 0) handleCancel?.();
	}, [data]);

	const handleQtyChange = (index: number, value: string) => {
		setData((prev) =>
			prev
				? prev.map((item, i) => (i === index ? { ...item, qty: value } : item))
				: prev,
		);
	};

	const handleDeleteRow = (index: number) => {
		setData((prev) => (prev ? prev.filter((_, i) => i !== index) : prev));
	};

	return (
		<Dialog open={open} onOpenChange={handleCancel}>
			{data && <ProductPdfGenerator product={data} ref={printPdfRef} />}

			<DialogContent
				onClose={handleCancel}
				className='w-full sm:max-w-[80vw] max-h-[80vh] p-0 gap-0 overflow-hidden flex flex-col rounded-[5px] border-0'
				aria-describedby={undefined}
				isCrossIcon={false}
			>
				<DialogTitle className='hidden'></DialogTitle>

				<div className='flex-1 overflow-y-auto [&_[data-slot=table-container]]:overflow-x-hidden'>
					<SimpleTable
						head={PRINT_PRODUCT_HEAD_DATA}
						rowClassName='border-grey-100'
					>
						{data && data.length > 0 ? (
							data.map((item, index) => (
								<TableRow
									key={index}
									className='cursor-pointer hover:bg-gray-100 border-none'
								>
									<TableCell className='font-normal text-sm text-semi-black pl-5 whitespace-normal text-wrap'>
										<div className='flex flex-row items-center gap-2'>
											<div className='bg-secondary-grey min-w-10 size-10 rounded border border-borderColor flex items-center justify-center'>
												{item?.image ? (
													<img
														src={item?.image as string}
														alt={item?.name}
														width={40}
														height={40}
														className='object-cover size-full rounded'
													/>
												) : (
													<PhotoIcon width={20} height={20} />
												)}
											</div>
											<span className='wrap-break-word'>{item?.name}</span>
										</div>
									</TableCell>

									<TableCell>
										<Input
											placeholder='Qty'
											name='qty'
											type='number'
											min={0}
											value={item.qty || ""}
											onChange={(e) => handleQtyChange(index, e.target.value)}
											className='h-[30px] border border-borderColor rounded-[3px] placeholder:text-grey text-sm font-normal'
										/>
									</TableCell>

									<TableCell className='h-[60px] flex justify-center items-center'>
										<TrashIconDefault onClick={() => handleDeleteRow(index)} />
									</TableCell>
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={PRINT_PRODUCT_HEAD_DATA.length}
									className='text-center'
								>
									No Product Found
								</TableCell>
							</TableRow>
						)}
					</SimpleTable>
				</div>

				<div className='w-full p-5 flex items-center justify-center'>
					<Button
						variant="primary"
						className="sm:max-w-[350px] w-full"
						onClick={() => {
							if (printPdfRef.current && data) {
								printPdfRef.current.generatePDF().finally(() => {
									handleCancel?.();
									toast.success("PDF generated successfully.");
								});
							}
						}}
					>
						Print
					</Button>
				</div>

				<CloseIcon
					className='absolute top-2.5 right-3 cursor-pointer'
					onClick={handleCancel}
				/>
			</DialogContent>
		</Dialog>
	);
};

export default PrintProductModal;
