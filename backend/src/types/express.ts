import { Request } from "express";
import { TUser } from "./user";

export type TAuthenticatedRequest = Request & {
    user?: TUser;
};
