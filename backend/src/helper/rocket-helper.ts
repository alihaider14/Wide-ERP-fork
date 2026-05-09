import axios from "axios";
import {TShop} from "~/types/shop";
import {decryptApiKey} from "~/utils/encryption";
import {BookRocketResult, BookRocketError, CourierOrderInput} from "~/types/courier-booking";

export async function bookSingleOrderAtRocket(
  shop: TShop,
  orderId: string,
  orderInput: CourierOrderInput,
): Promise<BookRocketResult> {
  const shopifyToken = decryptApiKey(shop.shopify_api_key);

  const shopifyOrder = await axios.get(
    `https://${shop.shopify_store_key}/admin/api/2023-07/orders/${orderId}.json?fields=id,order_number,fulfillment_status,fulfillments,tags,payment_gateway_names,total_shipping_price_set`,
    { headers: { "X-Shopify-Access-Token": shopifyToken } },
  );

  const order = shopifyOrder.data.order;

  if (order.fulfillment_status === "fulfilled") {
    throw {
      type: "business_error",
      status: 400,
      message: "Order already booked",
    } as BookRocketError;
  }

  const gateway = order.payment_gateway_names?.[0]?.toLowerCase() || "";

  let rambursType: "cont" | "cash" | "instrumente_plata";
  if (gateway.includes("cod") || gateway.includes("manual")) {
    rambursType = "cash";
  } else if (gateway.includes("check")) {
    rambursType = "instrumente_plata";
  } else {
    rambursType = "cont";
  }

  const shippingAmount = order.total_shipping_price_set?.shop_money?.amount || "0";
  let payer: "client" | "sender" | "recipient";
  if (gateway.includes("cod") || gateway.includes("manual")) payer = "recipient";
  else if (shippingAmount === "0") payer = "sender";
  else payer = "client";

  const payload = {
    api_key: process.env.ROCKET_API_KEY,
    type: "package",
    service_type: "regular",
    cnt: orderInput.items,
    weight: orderInput.kg,
    content: `${orderInput.items} item(s)`,
    customer_reference: String(order.order_number),
    ramburs: orderInput.cod,
    ramburs_type: rambursType,
    payer,
    use_default_from_address: true,
    to_name: orderInput.name,
    to_contact: orderInput.name,
    to_address: orderInput.address,
    to_city: orderInput.city,
    to_county: orderInput.city,
    to_country: "PK",
    to_phone: orderInput.phone,
  };

  let rocketResponse;
  try {
    const params = new URLSearchParams();
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });

    rocketResponse = await axios.post(
      "https://app.couriermanager.eu/cscourier/API/create_shipment",
      params,
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } },
    );
  } catch (err) {
    throw {
      type: "rocket_error",
      status: 400,
      message: "Rocket booking failed",
    } as BookRocketError;
  }

  const trackingNumber = rocketResponse.data?.data?.no;
  if (!trackingNumber) {
    throw {
      type: "rocket_error",
      status: 400,
      message: "No tracking number returned from Rocket",
    } as BookRocketError;
  }

  const trackingUrl =
    "https://app.couriermanager.eu/cscourier/Main?tracking=true&appcont=1545";

  const existingTags = order.tags ? order.tags.split(", ") : [];
  const hasFulfillments = order.fulfillments && order.fulfillments.length > 0;

  try {
    await Promise.all([
      !existingTags.includes("Rocket")
        ? axios.put(
            `https://${shop.shopify_store_key}/admin/api/2023-07/orders/${orderId}.json`,
            { order: { id: orderId, tags: [...existingTags, "Rocket"].join(", ") } },
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
        if (!hasFulfillments) {
          const fulfillmentOrdersRes = await axios.get(
            `https://${shop.shopify_store_key}/admin/api/2023-07/orders/${orderId}/fulfillment_orders.json`,
            { headers: { "X-Shopify-Access-Token": shopifyToken } },
          );

          const fulfillmentOrder = fulfillmentOrdersRes.data.fulfillment_orders[0];

          await axios.post(
            `https://${shop.shopify_store_key}/admin/api/2023-07/fulfillments.json`,
            {
              fulfillment: {
                line_items_by_fulfillment_order: [
                  { fulfillment_order_id: fulfillmentOrder.id },
                ],
                tracking_info: { company: "Rocket", number: trackingNumber, url: trackingUrl },
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
        }
      })(),
    ]);
  } catch (error) {
    console.error(error);
    throw {
      type: "shopify_fulfillment_error",
      status: 500,
      message: "Failed creating fulfillment",
    } as BookRocketError;
  }

  return {
    shopId: String(shop._id),
    orderId: String(orderId),
    trackingNumber,
    trackingUrl,
    rocketRaw: rocketResponse.data,
  };
}