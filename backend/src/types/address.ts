import z from "zod";
import { updateOrderAddressSchema } from "~/validations/shopify-address.schema";

export type AddressInput = z.infer<typeof updateOrderAddressSchema>["address"];

export interface ParsedShippingAddress {
	address1: string;
	address2?: string;
	city: string;
	zip?: string;
	country: string;
}

export type AddressValueWrapper = { value?: unknown };

export type AddressObjectInput = {
	address1?: string;
	address2?: string;
	city?: string;
	zip?: string;
	country?: string;
};
