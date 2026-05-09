import { Request, Response } from "express";
import Courier from "~/models/courier";
import Shop from "~/models/shop";
import type { TPopulatedShop } from "~/types/courier";

export const getCouriers = async (req: Request, res: Response): Promise<void> => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const size = parseInt(req.query.size as string) || 10;
        const q = (req.query.q as string) || "";
        const skip = (page - 1) * size;

        const filter = q
            ? {
                  $or: [
                      { name: { $regex: q, $options: "i" } },
                      {
                          shop: {
                              $in: await Shop.find({ name: { $regex: q, $options: "i" } }).distinct("_id"),
                          },
                      },
                  ],
              }
            : {};

        const total = await Courier.countDocuments(filter);
        const couriers = await Courier.find(filter)
            .populate("shop", "name")
            .sort({ updatedAt: -1 })
            .skip(skip)
            .limit(size);

        const result = couriers.map((courier) => {
            const shop = courier.shop as unknown as TPopulatedShop;
            const shopName = shop.name;
            const shopId = shop._id.toString();
            return {
                _id: courier._id,
                name: courier.name,
                shop: shopName,
                shop_id: shopId,
                status: courier.status,
                updated_at: courier.updatedAt,
            };
        });

        res.status(200).json({
            data: result,
            total,
            page,
            size,
        });
    } catch (error) {
        res.status(400).json({ error: error instanceof Error ? error.message : error });
    }
};
