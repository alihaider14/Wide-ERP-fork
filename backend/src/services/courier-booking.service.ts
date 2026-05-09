import Shop from "~/models/shop";
import { TShop } from "~/types/shop";
import { CourierOrderInput, BookingOptions } from "~/types/courier-booking";
import { TAuthenticatedRequest } from "~/types/express";
import { logActivity } from "./activity-logger.service";
import { Types } from "mongoose";

export async function handleCourierBooking({
  req,
  res,
  schema,
  bookingFunction,
  courierName,
}: BookingOptions) {
  try {
    const { validateWithZod } = await import("~/utils/errorHandling");
    const activistId = (req as TAuthenticatedRequest).user?._id;

    const validatedBody = await validateWithZod(schema, req.body);

    const { shop_id, orders } = validatedBody as {
      shop_id: string;
      orders: CourierOrderInput[];
    };

    const shop: TShop | null = await Shop.findById(shop_id);
    if (!shop) {
      return res.status(404).json({ error: "Shop not found" });
    }

    const orderResultsSettled = await Promise.allSettled(
      orders.map((orderInput) =>
        bookingFunction(shop, orderInput.orderId, orderInput),
      ),
    );

    const results = orderResultsSettled.map((result, index) => {
      const orderInput = orders[index];

      if (result.status === "fulfilled") {
        if (activistId) {
          logActivity({
            type: "book_at_courier",
            moduleID: new Types.ObjectId(shop_id),
            activity: `Order #${result.value.orderId} booked at ${courierName}. Tracking: ${result.value.trackingNumber}`,
            activistId,
          }).catch((err) =>
            console.error("Failed to log courier activity:", err)
          );
        }

        return {
          orderId: result.value.orderId,
          success: true,
          trackingNumber: result.value.trackingNumber,
          trackingUrl: result.value.trackingUrl,
        };
      }

      return {
        orderId: orderInput.orderId,
        success: false,
        error: result.reason?.message || "Unknown error",
        details: result.reason?.details || {},
      };
    });

    let totalOrders = results.length;
    let successfulOrders = 0;
    let failedOrders = 0;
    let alreadyBookedOrders = 0;

    for (const order of results) {
      if (order.success) {
        successfulOrders++;
      } else if (order.error?.toLowerCase().includes("already booked")) {
        alreadyBookedOrders++;
      } else {
        failedOrders++;
      }
    }

    const allSucceeded =
      successfulOrders > 0 && failedOrders === 0 && alreadyBookedOrders === 0;

    const warning =
      alreadyBookedOrders > 0 || (successfulOrders > 0 && failedOrders > 0);

    const parts: string[] = [];
    if (successfulOrders > 0)
      parts.push(
        successfulOrders === 1
          ? "1 order booked successfully"
          : `${successfulOrders} orders booked successfully`
      );
    if (failedOrders > 0)
      parts.push(
        failedOrders === 1
          ? "1 order failed booking"
          : `${failedOrders} orders failed booking`
      );
    if (alreadyBookedOrders > 0)
      parts.push(
        alreadyBookedOrders === 1
          ? "1 order was already booked"
          : `${alreadyBookedOrders} orders were already booked`
      );

    const message =
      parts.length > 0 ? parts.join(". ") + "." : "No orders processed.";

    return res.status(200).json({
      success: allSucceeded,
      warning,
      totalOrders,
      failedOrders,
      message,
      results,
    });
  } catch (error) {
    console.error(`${courierName} Booking Error:`, error);
    return res.status(500).json({
      error: `Internal server error while booking ${courierName}`,
    });
  }
}