export interface BillItem {
	product: string;
	sku: string;
	barcode: string;
	cost: number;
	qty: number;
	remaining_qty?: number;
	total_price: number;
}
export interface BillDetails {
	_id: string;
	bill_no: number;
	vendor: string;
	vendor_id: string;
	amount: number;
	items: BillItem[];
	bill_date: Date;
	created_at: string;
	updated_at: string;
}
export interface BillListItem {
	_id: string;
	bill_no: number;
	vendor: {
		_id: string;
		name: string;
	};
	amount: number;
	items: number;
	createdAt: string;
	updatedAt: string;
	bill_date: string;
}
export interface BillCreateInput {
	bill_no?: number;
	vendor: string;
	bill_date?: Date;
	items: BillItemInput[];
}
export interface BillItemInput {
	product: string;
	sku: string;
	barcode: string;
	cost: number;
	qty: number;
	remaining_qty?: number;
	total_price: number;
}

export interface BillsQueryResult {
	bills: BillListItem[];
	total_pages: number;
	total_rows: number;
	from: number;
	to: number;
	today_purchasing?: number;
}

export interface BillDeleteTarget {
	id: string;
	billNumber: string;
	vendorName: string;
}

export interface BillItemsModalProps {
	open: boolean;
	onClose: () => void;
	items: BillItem[];
	loading?: boolean;
}
