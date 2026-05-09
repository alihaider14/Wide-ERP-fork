import JsBarcode from "jsbarcode";
import QRCode from "qrcode";


export async function generateBarcodePNG(text: string): Promise<string> {
  const canvas = document.createElement("canvas");

  JsBarcode(canvas, text, {
    format: "CODE128",
    displayValue: false,
  });

  return canvas.toDataURL("image/png");
}

export async function generateQRCodePNG(value: string, size: number): Promise<string> {
  return QRCode.toDataURL(value, {
    width: size,
    margin: 0,
    color: { dark: "#000000", light: "#FFFFFF" },
  });
}