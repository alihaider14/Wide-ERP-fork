import { Request, Response } from 'express';
import axios from 'axios';
import { getShopDomainAndAccessToken } from '~/helper/shopify.helper';

export async function updateShopifyOrderNote(req: Request, res: Response) {
  try {
    const { store_id, order_id, note } = req.body;

    if (!store_id || !order_id || !note) {
      return res.status(400).json({ error: 'Missing required fields: store_id, order_id, note' });
    }

    const shopInfo = await getShopDomainAndAccessToken(store_id);
    if (!shopInfo) {
      return res.status(404).json({ error: 'Shop not found or missing access token' });
    }
    const { domain: shopDomain, accessToken } = shopInfo;

    const response = await axios.patch(
      `https://${shopDomain}/admin/api/2023-07/orders/${order_id}.json`,
      { order: { id: order_id, note } },
      {
        headers: {
          'X-Shopify-Access-Token': accessToken,
          'Content-Type': 'application/json',
        },
      }
    );
    res.json({ success: true, shopifyOrder: response.data });
  } catch (error: unknown) {
    let details = 'Unknown error';
    if (axios.isAxiosError(error)) {
      details = error.response?.data || error.message;
    } else if (error instanceof Error) {
      details = error.message;
    }
    console.error('Error updating Shopify order note:', error);
    res.status(500).json({ error: 'Failed to update order note', details });
  }
}
