import axios from "axios";
import { TShop } from "~/types/shop";
import { decryptApiKey } from "~/utils/encryption";
import { BookPostExResult, BookPostExError, CourierOrderInput } from "~/types/courier-booking";

export async function bookSingleOrderAtPostEx(
  shop: TShop,
  orderId: string,
  orderInput: CourierOrderInput,
): Promise<BookPostExResult> {
  const shopifyToken = decryptApiKey(shop.shopify_api_key);

  const shopifyOrder = await axios.get(
    `https://${shop.shopify_store_key}/admin/api/2023-07/orders/${orderId}.json?fields=id,order_number,fulfillment_status,fulfillments,tags`,
    { headers: { "X-Shopify-Access-Token": shopifyToken } },
  );

  const order = shopifyOrder.data.order;

  if (order.fulfillment_status === "fulfilled") {
    throw {
      type: "business_error",
      status: 400,
      message: "Order already booked",
    } as BookPostExError;
  }

  const payload = {
    orderRefNumber: String(order.order_number),
    invoicePayment: orderInput.cod,
    orderDetail: `${orderInput.items} item(s)`,
    customerName: orderInput.name,
    customerPhone: orderInput.phone,
    deliveryAddress: orderInput.address,
    cityName: orderInput.city,
    invoiceDivision: 1,
    items: orderInput.items,
    orderType: orderInput.type,
    pickupAddressCode: "002",
  };

  let postExResponse;
  try {
    postExResponse = await axios.post(
      "https://api.postex.pk/services/integration/api/order/v3/create-order",
      payload,
      {
        headers: {
          token: process.env.POSTEX_TOKEN!,
          "Content-Type": "application/json",
        },
      },
    );
  } catch (err) {
    throw {
      type: "postex_error",
      status: 400,
      message: "PostEx booking failed",
    } as BookPostExError;
  }

  const trackingNumber = postExResponse.data?.dist?.trackingNumber;
  if (!trackingNumber) {
    throw {
      type: "postex_error",
      status: 400,
      message: "No tracking number returned from PostEx",
    } as BookPostExError;
  }

  const trackingUrl = `https://track.postex.pk/${trackingNumber}`;

  const existingTags = order.tags ? order.tags.split(", ") : [];

  try {
    await Promise.all([
      // Add PostEx tag
      !existingTags.includes("PostEx")
        ? axios.put(
            `https://${shop.shopify_store_key}/admin/api/2023-04/orders/${orderId}.json`,
            { order: { id: orderId, tags: [...existingTags, "PostEx"].join(", ") } },
            { headers: { "X-Shopify-Access-Token": shopifyToken } },
          )
        : Promise.resolve(),

      // Save wd_shipper_remarks metafield
      orderInput.remarks
        ? axios.post(
            `https://${shop.shopify_store_key}/admin/api/2023-07/orders/${orderId}/metafields.json`,
            {
              metafield: {
                namespace: "custom",
                key: "wd_shipper_remarks",
                value: orderInput.remarks,
                type: "single_line_text_field",
              },
            },
            {
              headers: {
                "X-Shopify-Access-Token": shopifyToken,
                "Content-Type": "application/json",
              },
            },
          )
        : Promise.resolve(),

      (async () => {
        const hasFulfillments =
          order.fulfillments &&
          Array.isArray(order.fulfillments) &&
          order.fulfillments.length > 0;

        if (!hasFulfillments) {
          const fulfillmentOrdersRes = await axios.get(
            `https://${shop.shopify_store_key}/admin/api/2023-07/orders/${orderId}/fulfillment_orders.json`,
            { headers: { "X-Shopify-Access-Token": shopifyToken } },
          );

          const fulfillmentOrders = fulfillmentOrdersRes.data.fulfillment_orders || [];
          if (!fulfillmentOrders.length) {
            throw {
              type: "business_error",
              status: 400,
              message: "No fulfillment orders available for this order; cannot create fulfillment.",
            } as BookPostExError;
          }

          await axios.post(
            `https://${shop.shopify_store_key}/admin/api/2023-07/fulfillments.json`,
            {
              fulfillment: {
                line_items_by_fulfillment_order: [
                  { fulfillment_order_id: fulfillmentOrders[0].id },
                ],
                tracking_info: { company: "PostEx", number: trackingNumber, url: trackingUrl },
                notify_customer: true,
              },
            },
            {
              headers: {
                "X-Shopify-Access-Token": shopifyToken,
                "Content-Type": "application/json",
              },
            },
          );
        } else {
          const fulfillmentsRes = await axios.get(
            `https://${shop.shopify_store_key}/admin/api/2023-07/orders/${orderId}/fulfillments.json`,
            { headers: { "X-Shopify-Access-Token": shopifyToken } },
          );

          const fulfillments = fulfillmentsRes.data.fulfillments || [];
          if (fulfillments.length > 0) {
            await axios.post(
              `https://${shop.shopify_store_key}/admin/api/2023-07/fulfillments/${fulfillments[0].id}/update_tracking.json`,
              {
                fulfillment: {
                  notify_customer: true,
                  tracking_info: { company: "PostEx", number: trackingNumber, url: trackingUrl },
                },
              },
              {
                headers: {
                  "X-Shopify-Access-Token": shopifyToken,
                  "Content-Type": "application/json",
                },
              },
            );
          }
        }
      })(),
    ]);
  } catch (err) {
    throw {
      type: "shopify_fulfillment_error",
      status: 500,
      message: "Failed creating or updating fulfillment",
    } as BookPostExError;
  }

  return {
    shopId: String(shop._id),
    orderId: String(orderId),
    trackingNumber,
    trackingUrl,
    postExRaw: postExResponse.data,
  };
}