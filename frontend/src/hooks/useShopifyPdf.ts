import { PDFGeneratorHandle, TPDFOrder } from "@/types/pdf";
import { TPrintScannedOrder } from "@/types/shopify";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

const useShopifyPdf = () => {
	const packagingSlipPdfRef = useRef<PDFGeneratorHandle>(null);
	const scannedOrderPdfRef = useRef<PDFGeneratorHandle>(null);
	const [data, setData] = useState<TPDFOrder[] | null>(null);
	const [printScannedOrderData, setPrintScannedOrderData] =
		useState<TPrintScannedOrder | null>(null);

	const handlePrintPackagingSlip = (TPDFOrderData: TPDFOrder[]) => {
		setData(TPDFOrderData);
	};

	useEffect(() => {
		if (packagingSlipPdfRef.current && data) {
			packagingSlipPdfRef.current.generatePDF().finally(() => {
				setData(null);
				toast.success("PDF generated successfully.");
			});
		} else if (scannedOrderPdfRef.current && printScannedOrderData) {
			scannedOrderPdfRef.current.generatePDF().finally(() => {
				toast.dismiss();
				setPrintScannedOrderData(null);
				toast.success("PDF generated successfully.");
			});
		}
	}, [data, printScannedOrderData]);

	return {
		handlePrintPackagingSlip,
		packagingSlipPdfRef,
		pdfData: data,
		handlePrintScannedOrder: setPrintScannedOrderData,
		printScannedOrderData,
		scannedOrderPdfRef,
	};
};
export default useShopifyPdf;
