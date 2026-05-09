import express from "express";

import authenticateJWT from "~/middlewares/validate-token";
import { getPayments } from "~/controllers/payments/getPayments";
import { createPayment } from "~/controllers/payments/createPayment";
import { updatePayment } from "~/controllers/payments/updatePayment";
import { deletePayment } from "~/controllers/payments/deletePayment";

export default (router: express.Router) => {
  router.get("/payments", authenticateJWT("view_payments"), getPayments);
  router.post("/payment", authenticateJWT("create_payment"), createPayment);
  router.put("/payment", authenticateJWT("update_payment"), updatePayment);
  router.delete("/payment/:payment_id", authenticateJWT("delete_payment"), deletePayment);
};
