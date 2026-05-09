export interface ICreateVendor {
  name: string;
  email?: string;
  phone: string;
  opening_balance?: number;
}

export interface IUpdateVendor {
  name?: string;
  email?: string;
  phone?: string;
}

export interface IVendorResponse {
  _id: string;
  name: string;
  email?: string;
  phone: string;
  to_pay: number;
  opening_balance: number;
  createdAt: Date;
  updatedAt: Date;
}
