import { Request, Response } from 'express';
import StockZone from '../../models/stock_zone';

export const deleteStockZone = async (req: Request, res: Response) => {
  try {
    const { _id } = req.body;

    if (!_id) {
      return res.status(400).json({ message: '_id is required.' });
    }

    const stockZone = await StockZone.findById(_id);

    if (!stockZone) {
      return res.status(404).json({ message: 'Stock zone not found.' });
    }

    if (stockZone.total_quantity > 0) {
      return res.status(400).json({ message: 'Cannot delete stock zone with non-zero total quantity.' });
    }

    await StockZone.findByIdAndDelete(_id);

    return res.status(200).json({
      message: `${stockZone.name} has been successfully deleted.`,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'An error occurred while deleting the stock zone.',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};