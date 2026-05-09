import { Request, Response } from 'express';
import { ERROR_MESSAGES } from '~/constants/errorMessages';
import Shop from '~/models/shop';

export const getShopById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ error: 'Shop ID is required' });
      return;
    }

  const shop = await Shop.findById(id, { 
    shopify_api_key: 0, 
    meta_api_key: 0,
    postex_api_key: 0,
    insta_api_key: 0,
    rocket_api_key: 0,
    blueex_api_key: 0
  });

    if (!shop) {
      res.status(404).json({ error: 'Shop not found' });
      return;
    }

    res.status(200).json({
      shop,
    });
  } catch (error) {
    res
      .status(400)
      .json({ error: ERROR_MESSAGES.somethingWentWrong, details: error });
  }
};
