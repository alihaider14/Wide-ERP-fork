import { Request, Response } from 'express';
import StockZone from '../../models/stock_zone';

export const getStockZones = async (req: Request, res: Response) => {
  try {
    const { search = '', page = 1, size = 10 } = req.query;

    const query = search
      ? { name: { $regex: search, $options: 'i' } }
      : {};

    const limit = parseInt(size as string, 10) || 10;
    const skip = (parseInt(page as string, 10) - 1) * limit;

    const stockZones = await StockZone.find(query).skip(skip).limit(limit);
    const total = await StockZone.countDocuments(query);

    return res.status(200).json({
      data: stockZones,
      pagination: {
        total,
        page: parseInt(page as string, 10) || 1,
        size: limit,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: 'An error occurred while fetching stock zones.',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};