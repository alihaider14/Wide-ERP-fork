export type TUser = {
  user_id: string;
  _id: string;
  full_name: string;
  email: string;
  phone: string;
  designation: string;
  password?: string;
  access: string[];
  createdAt?: string;
  updatedAt?: string;
};

export type TAddAndUpdateUserResponse = {
  user: TUser;
};

export type TreeNode = {
  id: string;
  key: string;
  label?: string;
  defaultChecked?: boolean;
  children?: TreeNode[];
};
export type TUsersPrompt = {
  data: Partial<TUser>;
  open: boolean;
};

export type TGetUserResponse = {
  total_pages: number;
  total_rows: number;
  from: number;
  to: number;
  users: TUser[];
  // some views use start/end naming
  start?: number;
  end?: number;
};

export type TResetPassword = {
  token: string;
  newPassword: string;
  confirmPassword: string;
};

export type TSignInResponse = {
  token: string;
  user: TUser;
};

 export type TForgotPassword = {
  message: string;
  email: string;
 }