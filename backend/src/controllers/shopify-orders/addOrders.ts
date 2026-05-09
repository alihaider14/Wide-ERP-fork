
import { Request, Response } from 'express';
import axios from 'axios';
import { addShopifyOrderSchema } from '~/validations/shopify.schema';
import { validateWithZod } from '~/utils/errorHandling';

export async function addShopifyOrder(req: Request, res: Response) {
  try {
    const { shopDomain, accessToken, orderData } = await validateWithZod(addShopifyOrderSchema, req.body);
    const response = await axios.post(
      `https://${shopDomain}/admin/api/2023-07/orders.json`,
      { order: orderData },
      {
        headers: {
          'X-Shopify-Access-Token': accessToken,
          'Content-Type': 'application/json',
        },
      }
    );
    res.status(201).json(response.data);
  } catch (error) {
    console.error('Error creating Shopify order:', error);
    res.status(400).json({ error: error instanceof Error ? error.message : 'Failed to create order' });
  }
}


