
import { Request, Response } from 'express';
import axios from 'axios';
import { fulfillShopifyOrderSchema } from '~/validations/shopify.schema';
import { validateWithZod } from '~/utils/errorHandling';

export async function fulfillShopifyOrder(req: Request, res: Response) {
  try {
    const { shopDomain, accessToken, orderId, fulfillmentData } = await validateWithZod(fulfillShopifyOrderSchema, req.body);
    const response = await axios.post(
      `https://${shopDomain}/admin/api/2023-07/orders/${orderId}/fulfillments.json`,
      { fulfillment: fulfillmentData },
      {
        headers: {
          'X-Shopify-Access-Token': accessToken,
          'Content-Type': 'application/json',
        },
      }
    );
    res.status(201).json(response.data);
  } catch (error) {
    console.error('Error fulfilling Shopify order:', error);
    res.status(400).json({ error: error instanceof Error ? error.message : 'Failed to fulfill order' });
  }
}
