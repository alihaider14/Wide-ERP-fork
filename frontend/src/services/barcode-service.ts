import axios, { AxiosResponse } from "axios";

export const previewBarcode = async (
	sku: string,
	barcode: string,
	price: string
) => {
	const zpl = `^XA
				^FO40,50,2
				^FB220,2,0,C,0
				^AP
				^FD${sku}^FS

				^FO40,70,0
				^BY2,3,100
				^BCN,100,N,N
				^FD${barcode}^FS

				^FO40,180,2
				^FB220,2,0,C,0
				^AC,20
				^FDRs. ${price}^FS
				^XZ`;

	const response: AxiosResponse = await axios.get(
		`https://api.labelary.com/v1/printers/8dpmm/labels/1.5x1/0/${zpl}`,
		{
			responseType: "blob" // Important for binary data
		}
	);
	if (response.status === 200) {
		// Convert the response to a Blob
		const blob = await new Blob([response.data], { type: "image/png" });
		// Create a URL for the Blob
		const url = URL.createObjectURL(blob);

		return url;
	} else throw Error("Failed to fetch barcode preview");
};
