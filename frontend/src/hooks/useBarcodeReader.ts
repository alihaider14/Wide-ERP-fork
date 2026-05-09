import { getProducts } from "@/services/product-service";
import { TBarcodeReaderProps } from "@/types/Order";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

const useBarcodeReader = ({ onAddToCart }: TBarcodeReaderProps) => {
	const [barcode, setBarcode] = useState("");

	let barcodeScan = "";

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			setBarcode("");
			if (e.key === "Enter" && barcodeScan.length > 0) {
				handleScan(barcodeScan);
				return;
			}

			if (e.key === "Shift") {
				return;
			}

			barcodeScan += e.key;

			setTimeout(() => {
				barcodeScan = "";
			}, 100);
		};

		document.addEventListener("keydown", handleKeyDown);

		return () => {
			document.removeEventListener("keydown", handleKeyDown);
		};
	});

	const handleScan = (barcode: string) => {
		setBarcode(barcode);
	};

	const { data: availableProducts } = useQuery({
		queryKey: ["productsForOrder", 1, 10, undefined, barcode],
		queryFn: () => getProducts(1, 10, "active", undefined, barcode),
		enabled: barcode?.length > 0,
	});

	useEffect(() => {
		if (availableProducts?.products.length === 0) return;

		availableProducts?.products?.find((product) => {
			if (product?.barcode === barcode) {
				onAddToCart({
					product_id: product!._id,
					price: product?.price || 0,
					sku: product?.sku,
					quantity: product?.qty || 0,
					product_qty: product?.qty || 0,
				});
			}
		});
	}, [availableProducts?.products]);

	return;
};

export default useBarcodeReader;
