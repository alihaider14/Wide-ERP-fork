import {useRef, useState} from "react";
import {Button} from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {COLOR} from "@/constant/Colors";
import { PRODUCT_IMPORT_REQUIRED_COLUMNS } from "@/constant/importColumns";
import {XIcon} from "lucide-react";
import Papa from "papaparse";
import {TProduct} from "@/types/Products";

type TProps = {
  open: boolean;
  handleSubmit: (file: Partial<TProduct>[]) => void;
  handleCancel: () => void;
};

const ImportProductModal = ({open, handleSubmit, handleCancel}: TProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | undefined>();
  const [products, setProducts] = useState<Partial<TProduct>[] | null>(null);

  const [error, setError] = useState<string | undefined>();

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
        const {data, meta} = results;
        const columns = meta.fields?.map((f) => f.toLowerCase()) || [];

        const missingColumns = PRODUCT_IMPORT_REQUIRED_COLUMNS.filter(
          (col) => !columns.includes(col),
        );
        const extraColumns = columns.filter(
          (col) => !PRODUCT_IMPORT_REQUIRED_COLUMNS.includes(col),
        );

        if (missingColumns.length > 0) {
          setError(`File has missing column(s): ${missingColumns.join(", ")}`);
          setProducts(null);
          setFileName(selectedFile.name);
          return;
        }

        if (extraColumns.length > 0) {
          setError(
            `File contains unexpected column(s): ${extraColumns.join(", ")}`,
          );
          setProducts(null);
          setFileName(selectedFile.name);
          return;
        }

        if (data.length === 0) {
          setError("File has no data");
          setProducts(null);
          setFileName(selectedFile.name);
          return;
        }
        const rowData = data as unknown as Partial<TProduct>[];

        const skuSet = new Set();
        const barcodeSet = new Set();
        const duplicateRows: {
          index: number;
        }[] = [];

        rowData.forEach((row, index) => {
          const isDuplicate =
            skuSet.has(row.sku) || barcodeSet.has(row.barcode);

          if (!isDuplicate) {
            if (row.sku) skuSet.add(row.sku);
            if (row.barcode) barcodeSet.add(row.barcode);
          } else {
            duplicateRows.push({
              index: index + 1,
            });
          }
        });

        if (duplicateRows.length > 0) {
          const duplicateMessage = duplicateRows
            .map((row) => `Row ${row.index}`)
            .join(", ");

          setError(`Duplicate SKU/BARCODE found in: ${duplicateMessage}`);
          setProducts(null);
          setFileName(selectedFile.name);
          return;
        }

        const invalidRows = rowData.filter(
          (row) =>
            !row.sku?.trim() ||
            !row.barcode?.trim() ||
            isNaN(parseFloat(String(row.price))),
        );

        if (invalidRows.length > 0) {
          setError(`Some rows have missing values in sku, barcode or price`);
          setProducts(null);
          setFileName(selectedFile.name);
          return;
        }

        setProducts(
          rowData.map((row) => {
            const product: Partial<TProduct> = {
              sku: row.sku?.trim(),
              barcode: row.barcode?.trim(),
              price: parseFloat(String(row.price)),
            };
            const trimmedName = row.name?.trim();
            if (trimmedName) product.name = trimmedName;
            return product;
          }),
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
    if (!products) {
      fileInputRef.current?.click();
    } else {
      handleSubmit(products!);
      handleCancel();
      handleRemoveFile();
    }
  };

  const handleRemoveFile = () => {
    setProducts(null);
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
      <DialogContent className="sm:max-w-[500px] sm:py-[30px] sm:px-10 py-[15px] px-5 gap-[20px]">
        <DialogHeader className="text-center gap-[20px]">
          <DialogTitle>Import Products</DialogTitle>
          <DialogDescription>
            The supported format is .csv and it should have name, sku, barcode
            and price columns.
          </DialogDescription>
        </DialogHeader>

        <input
          type="file"
          ref={fileInputRef}
          accept=".csv"
          onChange={handleFileChange}
          className="hidden"
        />

        {fileName && (
          <div className="flex items-center justify-center gap-3.5">
            <span className="text-[20px] font-medium text-foreground">
              {fileName}
            </span>
            <XIcon
              className="size-4 cursor-pointer"
              color={COLOR.semiBlack}
              onClick={handleRemoveFile}
            />
          </div>
        )}

        {error && (
          <span className="text-red-dark text-sm text-center">{error}.</span>
        )}

        <DialogFooter className="gap-[20px] justify-center items-center">
          <Button
            onClick={onUploadClick}
            className="w-full sm:max-w-[350px]"
            disabled={!!error}
            variant={fileName ? "secondary" : "default"}
          >
            {fileName ? "Upload" : "Select File"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImportProductModal;
