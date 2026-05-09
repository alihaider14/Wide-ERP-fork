export type TEmployeeStatus = "Onboard" | "Active" | "On hold" | "Terminated";

export type TEmployee = {
	_id: string;
	full_name: string;
	designation: string;
	base_salary: number;
	phone: string;
	cnic: string;
	address: string;
	joined_at: Date;
	experience: string;
	status: TEmployeeStatus;
	last_paid?: Date;
	last_payment_amount?: number;
};
