import axios from "axios";
import {TShop} from "~/types/shop";
import {decryptApiKey} from "~/utils/encryption";
import {BookInstaResult, BookInstaError, CourierOrderInput} from "~/types/courier-booking";

export async function bookSingleOrderAtInsta(
  shop: TShop,
  orderId: string,
  orderInput: CourierOrderInput,
): Promise<BookInstaResult> {
  const shopifyToken = decryptApiKey(shop.shopify_api_key);

  const shopifyOrder = await axios.get(
    `https://${shop.shopify_store_key}/admin/api/2023-07/orders/${orderId}.json?fields=id,order_number,fulfillment_status,fulfillments,tags,financial_status`,
    { headers: { "X-Shopify-Access-Token": shopifyToken } },
  );

  const order = shopifyOrder.data.order;

  if (order.fulfillment_status === "fulfilled") {
    throw {
      type: "business_error",
      status: 400,
      message: "Order already booked",
    } as BookInstaError;
  }

  const [firstName, ...rest] = orderInput.name.trim().split(" ");
  const lastName = rest.join(" ");

  const payload = {
    ref_no: String(order.order_number),
    api_key: process.env.INSTA_API_KEY,
    consignee_first_name: firstName,
    consignee_last_name: lastName,
    consignee_email: "",
    consignee_phone: orderInput.phone,
    consignee_address: orderInput.address,
    consignee_city: orderInput.city.toUpperCase(),
    amount: Number(orderInput.cod),
    financial_status: order.financial_status,
    items: Array.from({ length: orderInput.items }, (_, i) => ({
      title: `Item ${i + 1}`,
      price: (Number(orderInput.cod) / orderInput.items).toFixed(2),
      quantity: 1,
      sku: "",
      kg: 1,
    })),
  };

  let instaResponse;
  try {
    instaResponse = await axios.post(
      "https://one-be.instaworld.pk/logistics/v1/createShipment",
      payload,
      { headers: { "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.log("error: ",err)
    throw {
      type: "insta_error",
      status: 400,
      message: "Insta booking failed",
    } as BookInstaError;
  }

  const trackingNumber = instaResponse.data?.tracking_number;
  if (!trackingNumber) {
    throw {
      type: "insta_error",
      status: 400,
      message: "No tracking number returned from Insta",
    } as BookInstaError;
  }

  const trackingUrl = `https://one-be.instaworld.pk/logistics/v1/trackShipment`;

  const existingTags = order.tags ? order.tags.split(", ") : [];

  try {
    await Promise.all([
      !existingTags.includes("Insta")
        ? axios.put(
            `https://${shop.shopify_store_key}/admin/api/2023-04/orders/${orderId}.json`,
            { order: { id: orderId, tags: [...existingTags, "Insta"].join(", ") } },
            { headers: { "X-Shopify-Access-Token": shopifyToken } },
          )
        : Promise.resolve(),

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
            } as BookInstaError;
          }

          await axios.post(
            `https://${shop.shopify_store_key}/admin/api/2023-07/fulfillments.json`,
            {
              fulfillment: {
                line_items_by_fulfillment_order: [
                  { fulfillment_order_id: fulfillmentOrders[0].id },
                ],
                tracking_info: { company: "Insta", number: trackingNumber, url: trackingUrl },
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
                  tracking_info: { company: "Insta", number: trackingNumber, url: trackingUrl },
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
  } catch (error) {
    console.error(error);
    throw {
      type: "shopify_fulfillment_error",
      status: 500,
      message: "Failed creating or updating fulfillment",
    } as BookInstaError;
  }

  return {
    shopId: String(shop._id),
    orderId: String(orderId),
    trackingNumber,
    trackingUrl,
    instaRaw: instaResponse.data,
  };
}