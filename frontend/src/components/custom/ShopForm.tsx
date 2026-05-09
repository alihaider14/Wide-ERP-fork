import {Input} from "../ui/input";
import {Button} from "../ui/button";
import {TShop} from "@/types/Shops";
import useShopConnection from "@/hooks/useShopConnection";

type TProps = {
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  data?: Partial<TShop>;
  handleSubmit?: () => void;
  submitBtnDisabled?: boolean;
  onCancel?: () => void;
  isUpdate?: boolean;
};

const ShopForm = ({
  onChange,
  data,
  handleSubmit,
  submitBtnDisabled,
  onCancel,
  isUpdate,
}: TProps) => {
  const {isConnected, verifyYourShop, installApp, handleChangeStore} =
    useShopConnection({data, onChange});

  return (
    <div className="w-full max-w-202.5 space-y-8">
      <div className="bg-white border border-border rounded-[6px] p-2 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          <h3 className="text-sm font-semibold text-semi-black">Shopify</h3>
          <div className="flex-1 border-t border-offWhite" />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Input
            placeholder="shop-name.myshopify.com"
            name="shopify_store_key"
            disabled={isConnected || isUpdate}
            onChange={onChange}
            value={data?.shopify_store_key || ""}
            label="Shopify Store Key *"
            className="custom-input"
          />

          <Input
            placeholder="shpca_..."
            name="shopify_api_key"
            onChange={onChange}
            disabled={isConnected || isUpdate}
            value={
              isConnected && data?.shopify_api_key
                ? data.shopify_api_key.slice(0, 8) + "......"
                : data?.shopify_api_key || ""
            }
            label="Shopify API Key *"
            className="custom-input"
          />
        </div>

        <div className="mt-6 text-sm text-gray-500 text-center">
          {isConnected || isUpdate ? (
            <>
              Your Shopify store is connected!{" "}
              {!isUpdate && (
                <span
                  className="text-green-600 font-medium hover:underline cursor-pointer"
                  onClick={handleChangeStore}
                >
                  Change Store
                </span>
              )}
            </>
          ) : (
            "* Verify your store if you've Store Key & API Key, otherwise install the app to your store to get access."
          )}
        </div>

        {!isConnected && !isUpdate && (
          <div className="mt-4 flex justify-center items-center gap-6">
            <button
              type="button"
              className="text-green-600 font-medium hover:underline cursor-pointer"
              onClick={verifyYourShop}
            >
              Verify Your Shop
            </button>

            <span className="text-gray-400">or</span>

            <button
              type="button"
              className="text-green-600 font-medium hover:underline cursor-pointer"
              onClick={installApp}
            >
              Install App to Connect
            </button>
          </div>
        )}
      </div>

      {(isConnected || isUpdate) && (
        <div className="bg-white border border-border rounded-[6px] p-6 sm:p-8">
          <div className="grid md:grid-cols-2 gap-6">
            <Input
              placeholder="Wide ERP"
              name="name"
              onChange={onChange}
              value={data?.name || ""}
              label="Name*"
            />

            <Input
              placeholder="+923331234567"
              name="phone"
              type="tel"
              onChange={onChange}
              value={data?.phone || ""}
              label="Phone*"
            />

            <Input
              placeholder="https://..."
              name="logo_url"
              onChange={onChange}
              value={data?.logo_url || ""}
              label="Logo URL"
              containerClassName="md:col-span-2"
            />
          </div>

          <div className="mt-10">
            <div className="flex items-center gap-3 mb-8">
              <h4 className="text-sm font-semibold text-semi-black">
                Social Media
              </h4>
              <div className="flex-1 border-t border-offWhite" />
            </div>

            <div className="grid md:grid-cols-2 gap-10">
              <Input
                placeholder="Facebook URL"
                name="facebook"
                onChange={onChange}
                value={data?.facebook || ""}
                label="Facebook"
              />

              <Input
                placeholder="Instagram URL"
                name="instagram"
                onChange={onChange}
                value={data?.instagram || ""}
                label="Instagram"
              />
              <Input
                placeholder="Snapchat URL"
                name="snapchat"
                onChange={onChange}
                value={data?.snapchat || ""}
                label="Snapchat"
                className="custom-input focus:shadow-none"
              />
              <Input
                placeholder="X URL"
                name="x"
                onChange={onChange}
                value={data?.x || ""}
                label="X"
                className="custom-input focus:shadow-none"
              />

              <Input
                placeholder="YouTube Channel URL"
                name="youtube"
                onChange={onChange}
                value={data?.youtube || ""}
                label="YouTube"
                containerClassName="md:col-span-2"
                className="custom-input focus:shadow-none"
              />
            </div>
          </div>

          <div className="mt-10">
            <div className="flex items-center gap-3 mb-8">
              <h4 className="text-sm font-semibold text-semi-black">Meta</h4>
              <div className="flex-1 border-t border-offWhite" />
            </div>

            <div className="grid md:grid-cols-2 gap-10">
              <Input
                placeholder="Meta Ads Manager ID"
                name="meta_ads_manager_id"
                onChange={onChange}
                value={data?.meta_ads_manager_id || ""}
                label="Meta Ads Manager ID"
                className="custom-input"
              />
              <Input
                placeholder="Meta Business Manager ID"
                name="meta_business_manager_id"
                onChange={onChange}
                value={data?.meta_business_manager_id || ""}
                label="Meta Business Manager ID"
                className="custom-input"
              />
              <Input
                placeholder="Meta API Key"
                name="meta_api_key"
                onChange={onChange}
                value={data?.meta_api_key || ""}
                label="Meta API Key"
                className="custom-input"
              />

              <Input
                placeholder="Expected ROAS"
                name="expected_roas"
                type="number"
                step="0.1"
                min="0"
                onChange={onChange}
                value={data?.expected_roas || ""}
                label="Expected ROAS"
                className="custom-input"
              />
            </div>
          </div>

          <div className="mt-10 grid md:grid-cols-2 gap-5">
            <Button onClick={handleSubmit} disabled={submitBtnDisabled}>
              Submit
            </Button>

            <Button variant="cancel" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopForm;
