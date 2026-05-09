import { Request, Response } from 'express';
import { ERROR_MESSAGES } from '~/constants/errorMessages';
import Order from '~/models/order';
import OrderItems from '~/models/order_items';

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const orderItems = await OrderItems.find({ order_id: id }).populate(
      'product_id'
    );

    const order = await Order.findById(id);

    if (!order) {
      res.status(400).json({ message: ERROR_MESSAGES.order });
      return;
    }

    const data = {
      ...order.toObject(),
      items: orderItems?.map((item) => {
        return {
          product_id: item.product_id?._id,
          price: item.price,
          quantity: item.quantity,
          sku: item.product_id?.sku,
          original_price: item.original_price,
          product_qty: item.product_id?.qty,
        };
      }),
    };

    res.status(200).json({
      order: data,
    });
  } catch (error) {
    res.status(400).json({ error });
  }
};
