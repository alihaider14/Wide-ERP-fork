import { Request, Response } from 'express';
import StockZone from '../../models/stock_zone';
import { SUCCESS_MESSAGES } from '../../constants/successMessages';

export const addStockZone = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    const stockZone = new StockZone({ name });
    await stockZone.save();

    return res.status(201).json({
      message: SUCCESS_MESSAGES.stockZoneCreated(name),
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({
      message: 'An error occurred while creating the stock zone.',
      error: errorMessage,
    });
  }
};