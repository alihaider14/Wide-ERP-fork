import { Request, Response } from "express";
import { TShop } from "./shop";
import { Schema } from "zod";

export type CourierOrderInput = {
  orderId: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  cod: string;
  kg: string;
  type: string;
  items: number;
  remarks?: string;
};

export type BookingOptions = {
  req: Request;
  res: Response;
  schema: Schema;
  bookingFunction: (
    shop: TShop,
    orderId: string,
    orderInput: CourierOrderInput,
  ) => Promise<CourierBookingResult>;
  courierName: string;
};

export type CourierBookingResult =
  | BookRocketResult
  | BookPostExResult
  | BookInstaResult;

export type BookRocketResult = {
  shopId: string;
  orderId: string;
  trackingNumber: string;
  trackingUrl: string;
  rocketRaw?: unknown;
};

export type BookRocketError = {
  type: "business_error" | "rocket_error" | "shopify_fulfillment_error";
  status: number;
  message: string;
  details?: unknown;
};

export type BookPostExResult = {
  shopId: string;
  orderId: string;
  trackingNumber: string;
  trackingUrl: string;
  postExRaw?: unknown;
};

export type BookPostExError = {
  type: "business_error" | "postex_error" | "shopify_fulfillment_error";
  status: number;
  message: string;
  details?: unknown;
};

export type BookInstaResult = {
  shopId: string;
  orderId: string;
  trackingNumber: string;
  trackingUrl: string;
  instaRaw?: unknown;
};

export type BookInstaError = {
  type: "business_error" | "insta_error" | "shopify_fulfillment_error";
  status: number;
  message: string;
  details?: unknown;
};