export type TReduceQtyLog = {
	_id: string;
	quantity: number;
	updated_by: string;
	adjustment_id: string;
	reason: string;
	createdAt: Date;
	updatedAt: Date;
};

export type TReduceQtyResponse = {
	reduce_qty_log: TReduceQtyLog;
};
