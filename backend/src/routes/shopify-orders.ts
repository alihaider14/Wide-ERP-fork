import express from "express";
import authenticateJWT from "~/middlewares/validate-token";
import {
	getShopifyOrders,
	updateShopifyOrderStatus,
	bulkUpdateOrdersStatus,
	bookAtCourier,
} from "../controllers/shopify-orders/shopifyOrders";
import { addShopifyOrder } from "../controllers/shopify-orders/addOrders";
import { fulfillShopifyOrder } from "../controllers/shopify-orders/fulfillOrder";
import { updateOrderAddress } from "~/controllers/shopify-orders/updateAddress";
import { updateShopifyOrderNote } from "../controllers/shopify-orders/updateNote";
import { printOrders } from "../controllers/shopify-orders/printOrders";
import {
	scanParcel,
	scanReturnParcel,
} from "~/controllers/shopify-orders/scanParcel";
import { getShopifySalesAnalytics } from "~/controllers/shopify-orders/shopifySalesAnalytics";
import { getShopifyOrdersByOrderIds } from "~/controllers/shopify-orders/getShopifyOrdersByOrderIds";
import { updateShopifyOrder } from "~/controllers/shopify-orders/updateShopifyOrder";
import { getShopifyProductByShopId } from "~/controllers/shopify-orders/getShopifyProductsByShopId";
import { mergeShopifyOrders } from "~/controllers/shopify-orders/mergeShopifyOrders";
const router = express.Router();

router.get(
	"/shopify-orders",
	authenticateJWT("view_shopify"),
	getShopifyOrders,
);
router.post(
	"/shopify-orders/add",
	authenticateJWT("view_shopify"),
	addShopifyOrder,
);
router.patch(
	"/shopify-order-address",
	authenticateJWT("view_shopify"),
	updateOrderAddress,
);
router.patch(
	"/shopify-order-note",
	authenticateJWT("view_shopify"),
	updateShopifyOrderNote,
);
router.post(
	"/shopify-orders/fulfill",
	authenticateJWT("view_shopify"),
	fulfillShopifyOrder,
);

router.post("/print-orders", authenticateJWT("view_shopify"), printOrders);
router.post("/scan-parcel", authenticateJWT("view_shopify"), scanParcel);
router.post(
	"/scan-return-parcel",
	authenticateJWT("view_shopify"),
	scanReturnParcel,
);

router.post(
	"/shopify-order/status",
	authenticateJWT("view_shopify"),
	updateShopifyOrderStatus,
);

router.post(
  "/book-at-courier",
  authenticateJWT("view_shopify"),
  bookAtCourier,
);

router.get(
	"/shopify-sales-analytics",
	authenticateJWT("view_shopify"),
	getShopifySalesAnalytics,
);
router.get(
	"/get-shopify-orders-by-ids",
	authenticateJWT("view_shopify"),
	getShopifyOrdersByOrderIds,
);

router.get(
	"/get-shopify-products",
	authenticateJWT("view_shopify"),
	getShopifyProductByShopId,
);

router.post(
	"/bulk-status-update",
	authenticateJWT("view_shopify"),
	bulkUpdateOrdersStatus,
);
router.post(
	"/update-shopify-order",
	authenticateJWT("view_shopify"),
	updateShopifyOrder,
);
router.post(
	"/merge-shopify-orders",
	authenticateJWT("view_shopify"),
	mergeShopifyOrders,
);

export default router;
