export type TVendor = {
  _id?: string;
  full_name: string;
  email: string;
  phone: string;
  address: string;
  to_pay: number;
  opening_balance: number;
  createdAt?: string;
  updatedAt?: string;
};

export type TAddAndUpdateUserResponse = {
  vendor: TVendor;
};