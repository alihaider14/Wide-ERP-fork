import { formatDateTimeToLocaleString } from "@/helper/time-formator";
import { TOrder, TOrderItems } from "@/types/Order";
import {
  Br,
  Cut,
  Line,
  Printer,
  Text,
  Row,
  render,
} from "react-thermal-printer";
import { UsbDevice } from "@/types/webusb";

const pad = (str: string, length: number, align = "left") => {
  if (align === "left") return str.padEnd(length, " ");
  return str.padStart(length, " ");
};

const renderHeadingRow = (
  name: string,
  total: string,
  qty: string,
  price: string
) => {
  return `${pad(name, 16)}${pad(total, 10)}${pad(qty, 6)}${pad(
    price,
    8,
    "right"
  )}`;
};

const renderItemRow = (qty: number, price: number) => {
  const total = qty * price || 0;
  return `${pad(`${qty} * ${price}`, 16)}${pad(price.toString(), 10)}${pad(
    "0.00",
    6
  )}${pad(total.toString(), 8, "right")}`;
};

const PrintReceipt = (
  orderData: Partial<TOrder>,
  cart: { [key: string]: TOrderItems }
) => (
  <Printer type="epson" width={40}>
    <Text size={{ width: 2, height: 2 }} bold align="center">
      Daily WholeSale
    </Text>
    <Line />
    <Text bold align="center">
      SALE RECEIPT
    </Text>
    <Line />
    <Text size={{ width: 1, height: 1 }}>
      INVOICE DATE:{" "}
      {formatDateTimeToLocaleString(
        orderData?.updatedAt || orderData?.createdAt
      )}
    </Text>
    <Br />
    <Text size={{ width: 1, height: 1 }}>
      PRINTED ON:{" "}
      {formatDateTimeToLocaleString(
        orderData?.updatedAt || orderData?.createdAt
      )}
    </Text>
    <Br />
    <Text size={{ width: 1, height: 1 }}>
      INVOICE #: {orderData?.order_number}
    </Text>
    <Br />
    <Text size={{ width: 1, height: 1 }}>CUSTOMER NAME: Walking Customer</Text>
    <Br />

    {/* heading */}
    <Line />
    <Text>{renderHeadingRow("Qty", "S.Total", "Disc", "Net amount")}</Text>
    <Line />

    {orderData?.items?.map((item) => (
      <>
        <Text>{cart?.[item?.product_id!]?.sku}</Text>
        <Text>{renderItemRow(item?.quantity, item?.price)}</Text>
      </>
    ))}

    <Line />
    <Row
      left="Total Qty"
      right={`${orderData?.items?.length?.toString()}x`}
      gap={2}
    />
    <Line />
    <Row
      left="Sub Total"
      right={`${orderData?.sub_total_amount?.toString() || 0} PKR`}
      gap={2}
    />
    <Line />
    <Row
      left="Discount"
      right={`${orderData?.sub_total_amount &&
          orderData?.total_amount &&
          orderData?.discount
          ? orderData?.sub_total_amount - Number(orderData?.total_amount)
          : 0
        } PKR`}
      gap={2}
    />
    <Line />
    <Row
      left="Net Amount"
      right={`${Number(orderData?.total_amount) || 0} PKR`}
      gap={2}
    />

    <Line />
    <Text size={{ width: 1, height: 1 }} bold align="center">
      Payments
    </Text>
    <Line />

    <Row
      left="Paid Amount"
      right={`${Number(orderData?.total_amount) || 0} PKR`}
    />
    <Line />

    <Row
      left="Balance"
      right={`${Number(orderData?.total_amount) - Number(orderData?.recieved_amount) ||
        0
        } PKR`}
    />
    <Line />

    <Text size={{ width: 1, height: 1 }} align="center">
      Thank you for shopping with us!
    </Text>
    <Text size={{ width: 1, height: 1 }} align="center">
      Sales Rep: Outlet Support
    </Text>
    <Text size={{ width: 1, height: 1 }} align="center">
      www.dailywholesale.pk
    </Text>
    <Cut />
  </Printer>
);

export const handlePrint = async (
  orderData: Partial<TOrder>,
  cart: { [key: string]: TOrderItems }
) => {
  const data: Uint8Array = await render(PrintReceipt(orderData, cart));

  try {
    const devices = await window.navigator.usb.getDevices();
    let device: UsbDevice;

    if (!devices?.length) {
      device = await window.navigator.usb.requestDevice({
        filters: [],
      });
    } else {
      device = await devices?.[0];
    }
    await device.open();

    await device.selectConfiguration(1);
    const iface = device.configuration.interfaces.find(
      (i) =>
        i.alternates.some((a) =>
          a.endpoints.some((e: { direction: string }) => e.direction === "out")
        )
    );

    if (!iface) throw new Error("No valid OUT interface found");

    await device.claimInterface(iface.interfaceNumber);
    const alt = iface.alternates.find((a) =>
      a.endpoints.some((e: { direction: string }) => e.direction === "out")
    );
    if (!alt) throw new Error("No valid alternate setting found");

    const endpoint = alt.endpoints.find(
      (e: { direction: string }) => e.direction === "out"
    );
    if (!endpoint) throw new Error("No OUT endpoint found");

    await device.transferOut(endpoint.endpointNumber, data);
  } catch (err) {
    console.error("Error printing:", err);
  }
};
