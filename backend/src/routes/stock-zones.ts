import { addStockZone } from '../controllers/stock-zones/addStockZone';
import { getStockZones } from '../controllers/stock-zones/getStockZones';
import { updateStockZone } from '../controllers/stock-zones/updateStockZone';
import { deleteStockZone } from '../controllers/stock-zones/deleteStockZone';
import { getStockZoneById } from '../controllers/stock-zones/getStockZoneById';
import authenticateJWT from '~/middlewares/validate-token';
import express from "express";

export default (router: express.Router) => {
    router.post("/stock-zones", authenticateJWT("add_stock_zone"), addStockZone);
    router.get("/stock-zones", authenticateJWT("view_stock_zone"), getStockZones);
    router.get("/stock-zones/:id", authenticateJWT("view_stock_zone"), getStockZoneById);
    router.put("/stock-zones", authenticateJWT("update_stock_zone"), updateStockZone);
    router.delete("/stock-zones", authenticateJWT("delete_stock_zone"), deleteStockZone);
};
