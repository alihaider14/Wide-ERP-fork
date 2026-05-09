import { Request, Response } from 'express';
import Shop from '~/models/shop';

export const getShopKeys = async (req: Request, res: Response): Promise<void> => {
  try {
    const shops = await Shop.find({}, {
      _id: 1,
      name: 1,
    });
    res.status(200).json({ shops });
  } catch (error) {
    res.status(400).json({ error });
  }
};
