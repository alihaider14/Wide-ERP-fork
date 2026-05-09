import { Types } from "mongoose";

export type CourierData = {
	name: string;
	contact: string;
	pickupAdress: string;
	returnAdress: string;
	details: string;
	remarks: string;
	cityName: string;
	trackingNumber: string;
	orderRefNumber: string;
	customerName: string;
	customerPhone: string;
	deliveryAddress: string;
	destination: string;
};

export enum CourierName {
	POSTEX = "PostEx",
	INSTA = "Insta",
	ROCKET = "Rocket",
}

export type TPopulatedShop = { _id: Types.ObjectId; name: string };

