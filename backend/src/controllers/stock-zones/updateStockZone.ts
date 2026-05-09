import { Request, Response } from 'express';
import StockZone from '../../models/stock_zone';
import { SUCCESS_MESSAGES } from '../../constants/successMessages';

export const updateStockZone = async (req: Request, res: Response) => {
  try {
    const { id, name } = req.body;

    if (!id || !name) {
      return res.status(400).json({ message: 'Both id and name are required.' });
    }

    const updatedStockZone = await StockZone.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );

    if (!updatedStockZone) {
      return res.status(404).json({ message: 'Stock zone not found.' });
    }

    return res.status(200).json({
      message: SUCCESS_MESSAGES.stockZoneUpdated(name),
    });
  } catch (error) {
    return res.status(500).json({
      message: 'An error occurred while updating the stock zone.',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};