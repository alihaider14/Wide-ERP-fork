import express from "express";
import { reduceQty } from "~/controllers/reduce-qty-logs/reduceQty";
import authenticateJWT from "~/middlewares/validate-token";

export default (router: express.Router) => {
	router.patch(
		"/reduce-quantity",
		authenticateJWT("adjust_quantity"),
		reduceQty,
	);
};
