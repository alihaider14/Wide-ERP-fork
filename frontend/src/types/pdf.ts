export type TPDFOrder = {
	storeName: string;
	shopId: string;
	shopifyStoreKey: string;
	storeLogo: string;
	orderDate: string;
	customerName: string;
	addressLine1: string;
	addressLine2: string;
	phone: string;
	city: string;
	state: string;
	orderNumber: string;
	note: string;
	trackingId: string;
	courierName: string;
	products: [
		{
			name: string;
			sku: string;
			price: number;
			quantity: number;
			total: number;
			image?: string;
		},
	];
	subtotal: number;
	shipping: number;
	total: number;
	gstAmount: number;
	consigneeInformation: {
		name: string;
		contact: string;
		deliveryAddress: string;
	};
	shipperInformation: {
		name: string;
		contact: string;
		pickupAdress: string;
		returnAdress: string;
		details: string;
	};
	shipmentInformation: {
		pieces: number;
		orderRef: string;
		trackingNumber: string;
		origin: string;
		destination: string;
		returnCity: string;
		remarks: string;
	};
	orderInformation: {
		orderType: string;
		amount: number;
	};
};

export type PDFGeneratorHandle = {
	generatePDF: () => Promise<void>;
};
