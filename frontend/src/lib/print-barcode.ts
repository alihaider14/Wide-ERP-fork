import ZebraBrowserPrintWrapper from "zebra-browser-print-wrapper";

export const printBarcode = async (
	sku: string,
	barcode: string,
	price: string,
	qty: number
) => {
	try {
		// Create a new instance of the object
		const browserPrint = new ZebraBrowserPrintWrapper();

		const availablePrinters = await browserPrint.getAvailablePrinters();

		// Select default printer
		await browserPrint.getDefaultPrinter();

		// Set the printer
		await browserPrint.setPrinter(availablePrinters[0]);

		await browserPrint.write("I am a test message.");

		await browserPrint.read();

		// ZPL script to print a simple barcode
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


				^FO344,50
				^FB220,2,0,C,0
				^AP
				^FD${sku}^FS
				
				^FO344,70
				^BY2,3,100
				^BCN,100,N,Y
				^FD${barcode}^FS
				
				^FO344,180
				^FB220,2,0,C,0
				^AC,20
				^FDRs. ${price}^FS

				^PQ${qty},0,2,Y 
				^XZ`;

		browserPrint.print(zpl);
	} catch (error) {
		throw new Error(error as string);
	}
};
