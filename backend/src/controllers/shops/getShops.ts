import { Request, Response } from 'express';
import { validateWithZod } from '~/utils/errorHandling';
import { getShopsSchema } from '~/validations/shop.schema';
import Shop from '~/models/shop';

export const getShops = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = await validateWithZod(getShopsSchema, req.query);
    const { pageNo, size, q, sortBy, sortOrder } = validatedData;

    const filter: {
      $or?: Array<
        | { name: { $regex: string; $options: string } }
        | { phone: { $regex: string; $options: string } }
      >;
    } = {};
    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: 'i' } },
        { phone: { $regex: q, $options: 'i' } },
      ];
    }

    const sortField = sortBy || 'createdAt';
    const sortDirection: 1 | -1 = sortOrder === 'asc' ? 1 : -1;

    const totalCount = await Shop.countDocuments(filter);

    let shops;
    let from = 0,
      to = 0,
      totalPages = 1;

    if (pageNo && size) {
      const skip = size * (pageNo - 1);
      shops = await Shop.find(filter, { 
        shopify_api_key: 0, 
        meta_api_key: 0,
        postex_api_key: 0,
        insta_api_key: 0,
        rocket_api_key: 0,
        blueex_api_key: 0
      })
        .sort({ [sortField]: sortDirection })
        .skip(skip)
        .limit(size);

      totalPages = Math.ceil(totalCount / size);
      from = shops.length ? skip + 1 : 0;
      to = skip + shops.length;
    } else {
      shops = await Shop.find(filter, { 
        shopify_api_key: 0, 
        meta_api_key: 0,
        postex_api_key: 0,
        insta_api_key: 0,
        rocket_api_key: 0,
        blueex_api_key: 0
      }).sort({ [sortField]: sortDirection });
      from = shops.length ? 1 : 0;
      to = shops.length;
    }

    res.status(200).json({
      total_pages: totalPages,
      total_rows: totalCount,
      from,
      to,
      shops,
    });
  } catch (error) {
    res.status(400).json({ error });
  }
};
