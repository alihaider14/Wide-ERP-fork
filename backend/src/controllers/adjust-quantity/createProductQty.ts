import { Request, Response } from 'express';
import { validateWithZod } from '~/utils/errorHandling';
import { createAdjustQtySchema } from '~/validations/productQuantity.schema';
import { ERROR_MESSAGES } from '~/constants/errorMessages';
import Product from '~/models/product';
import ProductsQuantity from '~/models/products_quantity';

export const createProductQty = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const validatedData = await validateWithZod(
      createAdjustQtySchema,
      req.body,
    );

    const { product_id, cost, quantity, reason, created_by } = validatedData;

    const product = await Product.findById(product_id);

    if (!product) {
      res.status(400).json({ error: ERROR_MESSAGES.productNotExists });
      return;
    }

    const newProduct = new ProductsQuantity({
      product_id,
      cost,
      quantity,
      remaining_qty: quantity < 0 ? 0 : quantity,
      reason,
      created_by,
    });

    const savedProduct = await newProduct.save();

    await Product.updateOne({ _id: product_id }, { $inc: { qty: quantity } });

    res.status(200).json({
      product_qty: savedProduct,
    });
  } catch (error) {
    console.error('Adjust Quantity API Error:', error);
    res.status(400).json({ error });
  }
};
