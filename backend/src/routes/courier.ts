import express from "express";
import { createCourier } from "~/controllers/couriers/createCourier";
import { getCouriers } from "~/controllers/couriers/getCouriers";
import { updateCourier } from "~/controllers/couriers/updateCourier";
import { deleteCourier } from "~/controllers/couriers/deleteCourier";
import { getCourierById } from "~/controllers/couriers/getCourierById";
import { getCouriersByShop } from "~/controllers/couriers/getCouriersByShop";
import authenticateJWT from "~/middlewares/validate-token";
import { getCitiesByCourier } from "../controllers/couriers/getCitiesByCourier";

export default (router: express.Router) => {
	router.post("/courier", authenticateJWT("create_courier"), createCourier);
	router.get("/couriers", authenticateJWT("view_couriers"), getCouriers);
	router.get("/courier/:id", authenticateJWT("view_couriers"), getCourierById);
	router.put("/courier", authenticateJWT("update_courier"), updateCourier);
	router.delete("/courier", authenticateJWT("delete_courier"), deleteCourier);
	router.get(
		"/couriers-by-shop",
		authenticateJWT("view_couriers"),
		getCouriersByShop,
	);
   router.get("/cities", authenticateJWT("view_couriers"), getCitiesByCourier);
};
