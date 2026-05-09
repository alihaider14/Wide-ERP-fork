import { Button } from "../ui/button";

type TProps = {
	onClick: () => void;
	barcodeUrl?: string;
};

const BarcodePreview = ({ onClick, barcodeUrl }: TProps) => {
	return (
		<div className='flex flex-col items-center'>
			<div
				className={`${
					barcodeUrl ? "border-none" : "border-grey border-dashed border"
				} w-full py-8 flex justify-center items-center`}
			>
				{barcodeUrl ? (
					<img src={barcodeUrl} alt='barcode' width={300} />
				) : (
					<p className='text-grey font-medium text-xs sm:text-sm'>
						Barcode will appear here...
					</p>
				)}
			</div>
			<Button variant='outline' onClick={onClick} className='mt-4'>
				Preview Barcode
			</Button>
		</div>
	);
};

export default BarcodePreview;
