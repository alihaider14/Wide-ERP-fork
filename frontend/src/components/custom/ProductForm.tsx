import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { TProduct } from "@/types/Products";
import ImagePicker from "./ImagePicker";
type TProps = {
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
	data?: Partial<TProduct>;
	handleSubmit?: () => void;
	handlePrintBarcode?: () => void;
	skuDisabled?: boolean;
	submitBtnDisabled?: boolean;
};

const ProductForm = ({
	onChange,
	data,
	handlePrintBarcode,
	handleSubmit,
	skuDisabled,
	submitBtnDisabled,
}: TProps) => {
	return (
		<div className='w-full bg-white border border-border rounded-[5px] max-w-[810px] p-5 sm:p-10 grid md:grid-cols-2 gap-5 sm:gap-10'>
			<div className='sm:col-span-2 flex md:flex-row flex-col items-center gap-10'>
				<ImagePicker
					containerClassName='w-fit'
					onChange={onChange}
					image={data?.image}
					name='image'
				/>

				<Input
					placeholder='Microwave Oven Cover'
					name='name'
					containerClassName='w-full'
					onChange={onChange}
					value={data?.name || ""}
					label='Name'
					maxLength={50}
				/>
			</div>

			<Input
				placeholder='SKU'
				name='sku'
				onChange={onChange}
				value={data?.sku || ""}
				label='SKU'
				maxLength={28}
				disabled={skuDisabled}
				required
			/>
			<Input
				placeholder='Barcode'
				label='Barcode'
				name='barcode'
				maxLength={10}
				onChange={onChange}
				value={data?.barcode || ""}
				required
			/>

			<Input
				placeholder='Price'
				name='price'
				label='Price'
				onChange={onChange}
				value={data?.price || ""}
				type='number'
				required
			/>

			<Input
				placeholder='Quantity'
				name='low_stock_indicator'
				label='Low Stock Indicator'
				onChange={onChange}
				value={data?.low_stock_indicator || ""}
				type='number'
			/>

			<Button
				variant='primary'
				onClick={handleSubmit}
				disabled={submitBtnDisabled}
				className='col-span-1'
			>
				Submit
			</Button>
			<Button
				variant='secondary'
				onClick={handlePrintBarcode}
				disabled={!data?.sku || !data?.barcode || !data?.price}
				className='col-span-1 bg-secondary-grey '
			>
				Print Barcode
			</Button>
		</div>
	);
};

export default ProductForm;
