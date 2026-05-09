import {
  AddressInput,
  AddressObjectInput,
  AddressValueWrapper,
  ParsedShippingAddress,
} from "~/types/address";

export function parseShippingAddress(
  address: AddressInput,
): ParsedShippingAddress {
  // Handle string format
  const raw =
    typeof address === "string"
      ? address
      : typeof address === "object" &&
        address !== null &&
        "value" in address &&
        typeof (address as AddressValueWrapper).value === "string"
      ? ((address as AddressValueWrapper).value as string)
      : null;

  if (raw) {
    const parts = raw
      .split(",")
      .map((s:string) => s.trim())
      .filter(Boolean);

    if (parts.length < 3) {
      throw new Error(
        "Address must be in format 'Street, City, Country'",
      );
    }

    const [address1, city, country] = parts;

    if (!address1 || !city || !country) {
      throw new Error(
        "Street, city, and country are required in the address string",
      );
    }

    return { address1, city, country };
  }

  // Handle object form
  if (address && typeof address === "object" && !Array.isArray(address)) {
    const { address1, address2, city, zip, country } = address as AddressObjectInput;

    if (!address1 || !city || !country) {
      throw new Error(
        "address1, city, and country are required in address object",
      );
    }

    const parsed: ParsedShippingAddress = { address1, city, country };
    if (address2) parsed.address2 = address2;
    if (zip) parsed.zip = zip;

    return parsed;
  }

  throw new Error("Valid address information is required");
}
