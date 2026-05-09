import {useEffect, useState} from "react";
import {useSearchParams} from "react-router-dom";
import {verifyShop} from "@/services/shop-service";
import toast from "react-hot-toast";
import { TShopConnectionProps } from "@/types/shop";

const useShopConnection = ({data, onChange}: TShopConnectionProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  // Handle shopify redirect for AddShop form only
  useEffect(() => {
    const shop = searchParams.get("shop");
    const ref = searchParams.get("ref");

    if (!shop || !ref) return;

    setIsConnected(true);

    onChange?.({
      target: {name: "shopify_store_key", value: shop},
    } as React.ChangeEvent<HTMLInputElement>);

    setSearchParams({});

  }, []);

  // Manual verification
  const verifyYourShop = async () => {
    if (!data?.shopify_store_key || !data?.shopify_api_key) {
      toast.error("Please enter Store Key and API Key");
      return;
    }

    try {
      const response = await verifyShop({
        shopify_store_key: data.shopify_store_key,
        shopify_api_key: data.shopify_api_key,
      });

      if (response.success) {
        setIsConnected(true);
        toast.success("Shop verified successfully!");
      }
    } catch (error: unknown) {
      const message =
        error &&
        typeof error === "object" &&
        "response" in error
          ? (
              error as {response?: {data?: {error?: string}}}
            ).response?.data?.error || "Verification failed"
          : "Verification failed";

      toast.error(message);
      setIsConnected(false);
    }
  };

  const installApp = () => {
    window.location.href =
      process.env.NODE_ENV === "development"
        ? import.meta.env.VITE_DISTRIBUTION_LINK_DEV
        : import.meta.env.VITE_DISTRIBUTION_LINK_PROD;
  };

  const handleChangeStore = () => {
    setIsConnected(false);

    if (onChange) {
      onChange({
        target: {name: "shopify_store_key", value: ""},
      } as React.ChangeEvent<HTMLInputElement>);

      onChange({
        target: {name: "shopify_api_key", value: ""},
      } as React.ChangeEvent<HTMLInputElement>);
    }

    setSearchParams({});
  };

  return {
    isConnected,
    verifyYourShop,
    installApp,
    handleChangeStore,
  };
};

export default useShopConnection;
