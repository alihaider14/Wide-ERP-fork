import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { COLOR } from "@/constant/Colors";
import { XIcon } from "lucide-react";
import Papa from "papaparse";
import { TImportAdjustQuantites } from "@/types/AdjustQty";
import useAccessStore from "@/hooks/useAccessStore";
import {
	PRODUCT_QTY_IMPORT_OPTIONAL_COLUMNS,
	PRODUCT_QTY_IMPORT_REQUIRED_COLUMNS,
} from "@/constant/importColumns";

type TProps = {
	open: boolean;
	handleSubmit: (file: TImportAdjustQuantites[]) => void;
	handleCancel: () => void;
};

const ImportProductQtyModal = ({
	open,
	handleSubmit,
	handleCancel,
}: TProps) => {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [fileName, setFileName] = useState<string | undefined>();
	const [productQuantites, setProductQuantites] = useState<
		TImportAdjustQuantites[] | null
	>(null);

	const [error, setError] = useState<string | undefined>();
	const { userId } = useAccessStore((state) => state);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const selectedFile = e.target.files?.[0];
		if (!selectedFile) return;

		if (!selectedFile.name.endsWith(".csv")) {
			setError("Please select a valid .csv file");
			return;
		}

		Papa.parse(selectedFile, {
			header: true,
			skipEmptyLines: true,
			complete: (results) => {
				const { data, meta } = results;
				const columns = meta.fields?.map((f) => f.toLowerCase()) || [];

				const missingColumns = PRODUCT_QTY_IMPORT_REQUIRED_COLUMNS.filter(
					(col) => !columns.includes(col),
				);
				const allowedColumns = PRODUCT_QTY_IMPORT_REQUIRED_COLUMNS.concat(
					PRODUCT_QTY_IMPORT_OPTIONAL_COLUMNS,
				);
				const extraColumns = columns.filter(
					(col) => !allowedColumns.includes(col),
				);

				if (missingColumns.length > 0) {
					setError(`File has missing column(s): ${missingColumns.join(", ")}`);
					setProductQuantites(null);
					setFileName(selectedFile.name);
					return;
				}

				if (extraColumns.length > 0) {
					setError(
						`File contains unexpected column(s): ${extraColumns.join(", ")}`,
					);
					setProductQuantites(null);
					setFileName(selectedFile.name);
					return;
				}

				if (data.length === 0) {
					setError("File has no data");
					setProductQuantites(null);
					setFileName(selectedFile.name);
					return;
				}
				const rowData = data as unknown as TImportAdjustQuantites[];

				const invalidRows = rowData.filter(
					(row) =>
						!row.reason?.trim() ||
						!row.reason?.trim() ||
						isNaN(parseFloat(String(row.quantity))) ||
						isNaN(parseFloat(String(row.cost))),
				);

				if (invalidRows.length > 0) {
					setError(
						`Some rows have missing values in sku, reason, quantity or cost`,
					);
					setProductQuantites(null);
					setFileName(selectedFile.name);
					return;
				}

				setProductQuantites(
					rowData.map((row) => ({
						sku: row.sku?.trim(),
						reason: row.reason?.trim(),
						quantity: parseFloat(String(row.quantity)),
						cost: parseFloat(String(row.cost)),
						created_by: userId as string,
					})),
				);
				setFileName(selectedFile.name);
				setError(undefined);
			},
			error: (error) => {
				setError("Failed to parse CSV file");
				console.error(error);
			},
		});
	};

	const onUploadClick = () => {
		if (!productQuantites) {
			fileInputRef.current?.click();
		} else {
			const withUser = productQuantites.map(row => ({
				...row,
				created_by: userId ? String(userId) : undefined,
			}));
			handleSubmit(withUser);
			handleCancel();
			handleRemoveFile();
		}
	};

	const handleRemoveFile = () => {
		setProductQuantites(null);
		setFileName(undefined);
		setError(undefined);
		fileInputRef.current!.value = "";
	};

	return (
		<Dialog
			open={open}
			onOpenChange={() => {
				handleCancel();
				handleRemoveFile();
			}}
		>
			<DialogContent className='sm:max-w-[500px] sm:py-[30px] sm:px-10 py-[15px] px-5 gap-[20px]'>
				<DialogHeader className='text-center gap-[20px]'>
					<DialogTitle>Import Quantities</DialogTitle>
					<DialogDescription>
						The supported format is .csv and it should have sku, reason, cost
						and quantity columns.
					</DialogDescription>
				</DialogHeader>

				<input
					type='file'
					ref={fileInputRef}
					accept='.csv'
					onChange={handleFileChange}
					className='hidden'
				/>

				{fileName && (
					<div className='flex items-center justify-center gap-3.5'>
						<span className='text-[20px] font-medium text-foreground'>
							{fileName}
						</span>
						<XIcon
							className='size-4 cursor-pointer'
							color={COLOR.semiBlack}
							onClick={handleRemoveFile}
						/>
					</div>
				)}

				{error && (
					<span className='text-red-dark text-sm text-center'>{error}.</span>
				)}

				<DialogFooter className='gap-[20px] justify-center items-center'>
					<Button
						onClick={onUploadClick}
						className='w-full sm:max-w-[350px]'
						disabled={!!error}
						variant="default"
					>
						{fileName ? "Upload" : "Select File"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default ImportProductQtyModal;
