import { Request, Response } from 'express';
import Courier from '~/models/courier';
import type { TPopulatedShop } from '~/types/courier';
export const getCouriersByShop = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { shop_id } = req.query;

    const couriers = await Courier.find({
      shop: shop_id,
      status: 'Active',
    })
      .populate('shop', 'name')
      .sort({ updatedAt: -1 });

    const result = couriers.map(({ _id, name, shop, status, updatedAt }) => {
      const populatedShop = shop as unknown as TPopulatedShop;
      return {
        _id,
        name,
        shop: populatedShop?.name ?? '',
        shop_id: populatedShop?._id?.toString() ?? String(shop),
        status,
        updated_at: updatedAt,
      };
    });

    res.status(200).json({ data: result });
  } catch (error) {
    res
      .status(500)
      .json({ error: error instanceof Error ? error.message : error });
  }
};
