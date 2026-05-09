import express from "express";

import authenticateJWT from "~/middlewares/validate-token";
import { createVendor } from "~/controllers/vendors/createVendor";
import { getVendors } from "~/controllers/vendors/getVendors";
import { updateVendor } from "~/controllers/vendors/updateVendor";
import { getVendorById } from "~/controllers/vendors/getVendorById";

export default (router: express.Router) => {
  router.post("/vendor", authenticateJWT("create_vendor"), createVendor);
  router.put("/vendor", authenticateJWT("update_vendor"), updateVendor);
  router.get("/vendors", authenticateJWT("view_vendors"), getVendors);
  router.get("/vendor/:id", authenticateJWT("view_vendors"), getVendorById);
};
