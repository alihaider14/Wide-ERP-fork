import { BarcodePreview, Layout, PageHeader } from "@/components";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import CustomSelect from "@/components/custom/CustomSelect";
import usePrintBarcode from "@/hooks/usePrintBarcode";

const PrintBarCode = () => {
	const {
		data,
		sku,
		barcode,
		price,
		printer,
		mediaType,
		barcodeUrl,
		handleChange,
		handleBarcodePreview,
		handlePrintBarcode,
		setMediaType,
		setPrinter,
		navigate,
	} = usePrintBarcode();

	return (
		<Layout>
			<PageHeader
				heading='Products'
				isbackIcon={true}
				backButtonText='Products'
				onClickBack={() => navigate("/products")}
			/>

			{/* <PrintBarcodeForm /> */}

			<div className='w-full bg-white border border-border rounded-[5px] max-w-[810px] p-5 sm:p-10 grid md:grid-cols-2 gap-[15px] sm:gap-[30px]'>
				<Input
					placeholder='SKU'
					containerClassName='sm:col-span-2'
					value={sku || ""}
					disabled
					label='SKU'
				/>

				<Input
					placeholder='Barcode'
					value={barcode || ""}
					disabled
					label='Barcode'
				/>

				<Input
					placeholder='Price'
					label='Price'
					value={price || ""}
					type='number'
					disabled
				/>

				<Input
					placeholder='Quantity'
					label='Quantity'
					name='qty'
					value={data.qty}
					onChange={handleChange}
					min={0}
					type='number'
					onKeyDown={(e) => {
						if (e.key === "e" || e.key === "E" || e.key === "+" || e.key === "-") {
						  e.preventDefault();
						}
					  }}
				/>

				<CustomSelect
					placeholder='Media Type'
					label='Media Type'
					onValueChange={(e) => setMediaType(e)}
					value={mediaType}
					data={[
						{
							label: "2 Rows Label",
							value: "2_row_label",
						},
					]}
				/>

				<div className='sm:col-span-2 gap-[30px] flex flex-col'>
					<CustomSelect
						label='Printer'
						onValueChange={(e) => setPrinter(e)}
						placeholder='Select Printer'
						value={printer}
						data={[
							{
								label: "Zebra Printer",
								value: "zebra_printer",
							},
						]}
					/>

					<BarcodePreview
						onClick={handleBarcodePreview}
						barcodeUrl={barcodeUrl}
					/>
				</div>

				<Button onClick={handlePrintBarcode}>Print</Button>
				<Button variant='secondary' onClick={() => navigate("/products")}>
					Cancel
				</Button>
			</div>
		</Layout>
	);
};

export default PrintBarCode;
