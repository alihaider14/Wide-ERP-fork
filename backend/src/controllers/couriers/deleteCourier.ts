import { Request, Response } from 'express';
import Courier from '~/models/courier';
import type { TPopulatedShop } from '~/types/courier';

export const deleteCourier = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { _id } = req.body;
    const courier = await Courier.findById(_id).populate('shop', 'name');
    if (!courier) {
      res.status(404).json({ error: 'Courier not found' });
      return;
    }

    const shopName = (courier.shop as unknown as TPopulatedShop).name;

    await Courier.findByIdAndDelete(_id);
    res.status(200).json({
      message: `${courier.name} for ${shopName} has been deleted successfully.`,
    });
  } catch (error) {
    res
      .status(400)
      .json({ error: error instanceof Error ? error.message : error });
  }
};
