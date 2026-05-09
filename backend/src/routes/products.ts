import express from "express";

import authenticateJWT from "~/middlewares/validate-token";
import { addProduct } from "~/controllers/products/addProduct";
import { updateProduct } from "~/controllers/products/updateProduct";
import { getProducts } from "~/controllers/products/getProducts";
import { getProductById } from "~/controllers/products/getProductById";
import { deleteProductById } from "~/controllers/products/deleteProductById";
import { importProducts } from "~/controllers/products/importProducts";
import { syncShopify } from "~/controllers/products/syncShopify";
import { multerMiddleWare } from "~/config/multer.config";

export default (router: express.Router) => {
	router.post(
		"/products",
		multerMiddleWare.single("image"),
		authenticateJWT("create_product"),
		addProduct,
	);
	router.post(
		"/import-products",
		authenticateJWT("create_product"),
		importProducts,
	);
	router.put(
		"/products",
		multerMiddleWare.single("image"),
		authenticateJWT("update_product"),
		updateProduct,
	);
	router.get("/products", authenticateJWT("view_products"), getProducts);
	router.get("/products/:id", authenticateJWT(), getProductById);
	router.delete(
		"/products/:id",
		authenticateJWT("delete_product"),
		deleteProductById,
	);
	router.post("/sync-shopify", authenticateJWT("sync_products"), syncShopify);
};
