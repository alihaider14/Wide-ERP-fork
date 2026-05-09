import express from "express";

import authenticateJWT from "~/middlewares/validate-token";
import {addShop} from "~/controllers/shops/addShops";
import {updateShop} from "~/controllers/shops/updateShops";
import {getShops} from "~/controllers/shops/getShops";
import {getShopKeys} from "~/controllers/shops/getShopKeys";
import {deleteShopById} from "~/controllers/shops/deleteShopById";
import {getShopById} from "~/controllers/shops/getShopById";
import {
  authorizeStore,
  connectStore,
  verifyShop,
} from "~/controllers/shops/connectStore";

export default (router: express.Router) => {
  router.post("/shops", authenticateJWT("create_shops"), addShop);
  router.put("/shops", authenticateJWT("update_shops"), updateShop);
  router.get("/shops", authenticateJWT("view_shops"), getShops);
  router.get("/shops/keys", authenticateJWT("view_shops"), getShopKeys);
  router.get("/shops/:id", authenticateJWT("view_shops"), getShopById);
  router.delete("/shops/:id", authenticateJWT("delete_shops"), deleteShopById);

  router.get("/redirect", connectStore);
  router.get("/authorize", authorizeStore);
  router.post("/verify-shop", verifyShop);
};
