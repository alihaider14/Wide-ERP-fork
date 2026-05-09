import { Types } from "mongoose";

export interface IActivityLog {
    type: string;
    moduleID: Types.ObjectId | string;
    activity: string;
    activistId: Types.ObjectId | string;
}

export interface IGetActivitiesParams {
    page?: number;
    size?: number;
    from?: string;
    to?: string;
}