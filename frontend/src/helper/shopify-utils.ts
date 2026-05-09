import { Facebook, Instagram, Twitter, Snapchat, YouTube } from "@/assets/svg";
import { TShopifyProduct, TUpdateShopifyOrder } from "@/types/shopify";
import React from "react";
import { calculateProductDiscount } from "./number-formator";

export type DateRange = {
	from: Date;
	to: Date;
};

export const socialIconMap: Record<string, React.ReactNode> = {
	facebook: React.createElement("img", {
		src: Facebook,
		alt: "facebook",
		className: "w-5 h-5",
	}),
	instagram: React.createElement("img", {
		src: Instagram,
		alt: "instagram",
		className: "w-5 h-5",
	}),
	youtube: React.createElement("img", {
		src: YouTube,
		alt: "youtube",
		className: "w-5 h-5",
	}),
	snapchat: React.createElement("img", {
		src: Snapchat,
		alt: "snapchat",
		className: "w-5 h-5",
	}),
	x: React.createElement("img", {
		src: Twitter,
		alt: "x",
		className: "w-5 h-5",
	}),
};

export function getComputedStatus(
	wdStatus: string,
	deliveryStatus: string,
): string {
	const ds = (deliveryStatus || "").toUpperCase();
	const hasNoDS = !ds;
	const hasNoWdStatus = !wdStatus || wdStatus === "" || wdStatus === "Pending";

	if (ds === "CANCELED" || wdStatus === "Cancelled") return "Cancelled";
	if (wdStatus === "Return Received") return "Rec. Return";
	if (hasNoDS && hasNoWdStatus) return "Pending";
	if (hasNoDS && wdStatus === "Ready to Ship") return "Ready to Ship";
	if (hasNoDS && wdStatus === "Paid") return "Paid";
	if (
		ds === "FULFILLED" &&
		wdStatus !== "Scanned" &&
		wdStatus !== "Return Received"
	)
		return "Booked";
	if ((hasNoDS || ds === "FULFILLED") && wdStatus === "Scanned")
		return "Scanned";
	if (ds === "FULFILLED" && wdStatus !== "Scanned") return "Booked";
	if (ds === "IN_TRANSIT") return "In-Transit";
	if (ds === "OUT_FOR_DELIVERY") return "Out for Delivery";
	if (ds === "ATTEMPTED_DELIVERY") return "Attempted";
	if (ds === "NOT_DELIVERED") return "Failed";
	if (ds === "DELIVERED") return "Delivered";

	return wdStatus;
}

export const mergeShopifyProducts = (
	products1: TShopifyProduct[],
	products2: TShopifyProduct[],
): TShopifyProduct[] => {
	const map = new Map<string, TShopifyProduct>();

	for (const p of products1) {
		map.set(p.sku, { ...p, actualPrice: Number(p.price || 0) });
	}

	for (const p of products2) {
		if (map.has(p.sku)) {
			const existing = map.get(p.sku)!;
			map.set(p.sku, {
				...existing,
				qty: Number(existing.qty || 0) + Number(p.qty || 0),
				actualQty: Math.max(
					Number(existing.actualQty || 0),
					Number(p.actualQty || 0),
				),
			});
		} else {
			map.set(p.sku, { ...p, actualPrice: Number(p.price || 0) });
		}
	}

	return Array.from(map.values());
};

export const mergeTextFields = (a?: string, b?: string): string => {
	const trimA = a?.trim() ?? "";
	const trimB = b?.trim() ?? "";
	if (!trimA && !trimB) return "";
	if (!trimA) return trimB;
	if (!trimB) return trimA;
	if (trimA === trimB) return trimA;
	return `${trimA}, ${trimB}`;
};

export const stripShopifyOrderFields = (
	products: TShopifyProduct[],
): Omit<TShopifyProduct, "actualPrice" | "actualQty" | "image">[] =>
	products.map(({ actualPrice, actualQty, image, ...rest }) => rest);

/**
 * Derives the implicit tax percentage from a single order's financials.
 */
export const deriveShopifyTaxPercentage = (
	order: TUpdateShopifyOrder,
): number => {
	const subtotal =
		order.product.reduce(
			(sum, item) => sum + Number(item.price || 0) * Number(item.qty || 0),
			0,
		) || 0;

	const discount = calculateProductDiscount(subtotal, order.discount || "0");
	const discountedSubtotal = subtotal - discount;
	const shipping = Number(order.deliveryCharges || 0);
	const total = Number(order.totalAmount || 0);
	const tax = total - (discountedSubtotal + shipping);

	return discountedSubtotal > 0 ? tax / discountedSubtotal : 0;
};
