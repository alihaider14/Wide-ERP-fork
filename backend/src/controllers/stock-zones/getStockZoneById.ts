import { Request, Response } from 'express';
import StockZone from '../../models/stock_zone';

export const getStockZoneById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const stockZone = await StockZone.findById(id);

    if (!stockZone) {
      return res.status(404).json({ message: 'Stock Zone not found' });
    }

    return res.status(200).json(stockZone);
  } catch (error) {
    return res.status(500).json({
      message: 'An error occurred while fetching the stock zone.',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};