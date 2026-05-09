export type BulkTrackingResponse = {
	trackingNumber: string;
	orderRefNumber: string;
	orderDetail?: string;
	merchantName: string;
	transactionNotes?: string;
	pickupAddress?: string;
	returnAddress?: string;
	customerName: string;
	customerPhone: string;
	deliveryAddress: string;
	cityName: string;
};

export type GetMerchanAdress = {
	address: string;
	phone1: string;
	phone2: string;
	contactPersonName: string;
	cityName: string;
	addressType: "Pickup/Return Address" | "Default Address";
};
