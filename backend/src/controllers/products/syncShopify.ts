import {Response} from "express";
import {TAuthenticatedRequest} from "~/types/express";
import Shop from "~/models/shop";
import {BackgroundTask} from "~/models/BackgroundTask";
import {SyncShopifyProducts} from "~/models/SyncShopifyProducts";

export const syncShopify = async (
  req: TAuthenticatedRequest,
  res: Response,
) => {
  try {
    const {shopId} = req.body;

    const shop = await Shop.findById(shopId);
    if (!shop) return res.status(404).json({message: "Shop not found"});

    const existing = await BackgroundTask.findOne({
      status: "In progress",
    });

    if (existing) return res.json({message: "Sync already running"});

    const syncDoc = await SyncShopifyProducts.create({
      store_name: shop.shopify_store_key,
    });

    const lastTask = await BackgroundTask.findOne({})
      .sort({task_no: -1})
      .select("task_no");

    const nextTaskNo = lastTask ? lastTask.task_no + 1 : 1;

    await BackgroundTask.create({
      task_no: nextTaskNo || 1,
      type: "sync_product",
      note: `Syncing products from ${shop.name}`,
      doc_id: syncDoc._id,
    });

    res.status(200).json({message: "Sync started..."});
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Shopify sync failed",
    });
  }
};
