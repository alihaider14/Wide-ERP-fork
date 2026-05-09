import { Request, Response } from 'express';
import Shop from '~/models/shop';

export const deleteShopById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const shop = await Shop.findByIdAndDelete(id);
    if (!shop) {
      res.status(400).json({ message: 'Shop not found' });
      return;
    }
    res.status(200).json({
      message: `${shop.name} has been deleted successfully.`,
    });
  } catch (error) {
    res.status(400).json({ error });
  }
};
