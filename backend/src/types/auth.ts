import { Request } from 'express';
import { TUser } from './user';

export interface AuthenticatedRequest extends Request {
  user?: TUser; // JWT verify se attach hone wala user object
}
export type TAuthPayload = {
  _id: string;
  access: string[];
};
