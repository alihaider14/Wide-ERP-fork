import { Request, Response } from 'express';
import Courier from '~/models/courier';
import type { TPopulatedShop } from '~/types/courier';

export const getCourierById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const courier = await Courier.findById(id).populate('shop', 'name');
    if (!courier) {
      res.status(404).json({ error: 'Courier not found' });
      return;
    }

    const populatedShop = courier.shop as unknown as TPopulatedShop;

    res.status(200).json({
      _id: courier._id,
      name: courier.name,
      address_code: courier.address_code,
      status: courier.status,
      pickup_address: courier.pickup_address,
      return_address: courier.return_address,
      created_at: courier.createdAt,
      updated_at: courier.updatedAt,
      shop: populatedShop?.name ?? '',
      shop_id: populatedShop?._id ?? courier.shop,
    });
  } catch (error) {
    res
      .status(400)
      .json({ error: error instanceof Error ? error.message : error });
  }
};
