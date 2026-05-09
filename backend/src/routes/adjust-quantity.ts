import express from "express";

import authenticateJWT from "~/middlewares/validate-token";
import { createProductQty } from "~/controllers/adjust-quantity/createProductQty";
import { updateProductQty } from "~/controllers/adjust-quantity/updateProductQty";
import { getProductQuantities } from "~/controllers/adjust-quantity/getProductQuantities";
import { getProductQtyById } from "~/controllers/adjust-quantity/getProductQtyById";
import { importProductQuantities } from "~/controllers/adjust-quantity/importProductQuantities";
import { getAdjustmentHistory } from "~/controllers/adjust-quantity/getAdjustmentHistory";

export default (router: express.Router) => {
	router.post(
		"/adjust-quantity",
		authenticateJWT("adjust_quantity"),
		createProductQty,
	);
	router.put(
		"/adjust-quantity",
		authenticateJWT("adjust_quantity"),
		updateProductQty,
	);
	router.post(
		"/import-products-quantities",
		authenticateJWT("adjust_quantity"),
		importProductQuantities,
	);
	router.get(
		"/adjust-quantity",
		authenticateJWT("adjust_quantity"),
		getProductQuantities,
	);
	router.get("/adjust-quantity/:id", authenticateJWT(), getProductQtyById);
	router.get(
		"/adjustment-histories",
		authenticateJWT("adjust_quantity"),
		getAdjustmentHistory,
	);
};
