import express from "express";

import authenticateJWT from "~/middlewares/validate-token";
import { addOrder } from "~/controllers/order/addOrder";
import { getOrderItems } from "~/controllers/order/getOrderItems";
import { orderStatus } from "~/controllers/order/orderStatus";
import { updateOrder } from "~/controllers/order/updateOrder";
import { getOrders } from "~/controllers/order/getOrders";
import { getOrderById } from "~/controllers/order/getOrderById";
import { getOrderLogsHistory } from "~/controllers/order/getOrderLogsHistory";

export default (router: express.Router) => {
	router.post("/orders", authenticateJWT("create_order"), addOrder);
	router.get("/orders-items/:order_id", authenticateJWT(), getOrderItems);
	router.get(
		"/order-logs",
		authenticateJWT("view_order_history"),
		getOrderLogsHistory,
	);
	router.patch("/orders", authenticateJWT("update_order_status"), orderStatus);
	router.put("/orders", authenticateJWT("update_order"), updateOrder);
	router.get("/orders", authenticateJWT("view_orders"), getOrders);
	router.get("/orders/:id", authenticateJWT(), getOrderById);
};
