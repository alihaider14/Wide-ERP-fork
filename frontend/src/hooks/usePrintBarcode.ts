import { useState } from "react";
import { previewBarcode } from "@/services/barcode-service";
import { printBarcode } from "@/lib/print-barcode";
import { useNavigate, useLocation } from "react-router-dom";

const usePrintBarcode = () => {
	const navigate = useNavigate();
	const { state } = useLocation();

	const [data, setData] = useState({
		qty: 1,
		media_type: "Label",
	});

	const [printer, setPrinter] = useState("zebra_printer");
	const [mediaType, setMediaType] = useState("2_row_label");
	const [barcodeUrl, setBarcodeUrl] = useState<string>();

	if (!state?.product) navigate("/products");

	const { price, barcode, sku } = state.product;

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setData({
			...data,
			[e.target.name]: e.target.value,
		});
	};

	const handleBarcodePreview = () => {
		previewBarcode(sku, barcode, price).then((res) => {
			setBarcodeUrl(res);
		});
	};

	const handlePrintBarcode = () => {
		printBarcode(sku, barcode, price, data.qty).catch((error) => {
			console.error("Error while printing barcode", error);
		});
	};
	return {
		data,
		sku,
		barcode,
		price,
		printer,
		mediaType,
		barcodeUrl,
		navigate,
		handleChange,
		handleBarcodePreview,
		handlePrintBarcode,
		setMediaType,
		setPrinter,
	};
};
export default usePrintBarcode;
