import {Input} from "../ui/input";
import {Dropdown} from "../ui/dropdown";
import {TCourier} from "@/types/Courier";
import CustomAutocomplete from "./CustomAutocomplete";
import FormActionButtons from "./FormActionButtons";

interface CourierFormProps {
  courierData: Partial<TCourier>;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
  handleSubmit: () => void;
  handleCancel?: () => void;
  isUpdate?: boolean;
  shops?: {id: string; name: string}[];
  shopsLoading?: boolean;
  setCourierData: React.Dispatch<React.SetStateAction<Partial<TCourier>>>;
}

function CourierForm({
  courierData,
  onChange,
  handleCancel,
  handleSubmit,
  shops = [],
  setCourierData,
}: CourierFormProps) {
  return (
    <>
      <div className="max-w-[1190px] w-auto flex flex-col gap-6 mt-5 bg-white p-[40px] rounded-[5px] border border-border">
        <div className="grid grid-cols-2 gap-[30px]">
          <CustomAutocomplete
            data={[
              {name: "PostEx", id: "PostEx"},
              {name: "Insta", id: "Insta"},
              {name: "Rocket", id: "Rocket"},
            ]}
            placeholder="Name"
            label="Name"
            name="name"
            value={courierData?.name ?? ""}
            onChange={onChange}
            handleSelect={(item) => {
              setCourierData((prev) => ({
                ...prev,
                name: item.name,
                address_code: item.name === "PostEx" ? prev.address_code : "",
              }));
            }}
          />

          {courierData?.name === "PostEx" ? (
            <Input
              label="Address Code"
              placeholder="Address Code"
              name="address_code"
              value={courierData?.address_code || ""}
              onChange={onChange}
            />
          ) : (
            <CustomAutocomplete
              data={
                shops?.map((shop) => ({
                  name: shop.name,
                  id: shop.id,
                })) || []
              }
              placeholder="Shop"
              label="Shop"
              name="shop"
              value={courierData?.shop ?? ""}
              onChange={onChange}
              handleSelect={(item) => {
                setCourierData((prev) => ({
                  ...prev,
                  shop: item.id,
                }));
              }}
            />
          )}

          {courierData?.name === "PostEx" && (
            <CustomAutocomplete
              data={
                shops?.map((shop) => ({
                  name: shop.name,
                  id: shop.id,
                })) || []
              }
              placeholder="Shop"
              label="Shop"
              name="shop"
              value={courierData?.shop ?? ""}
              onChange={onChange}
              handleSelect={(item) => {
                setCourierData((prev) => ({
                  ...prev,
                  shop: item.id,
                }));
              }}
            />
          )}

          <Input
            label="Api Key"
            placeholder="Api Key"
            name="api_key"
            type="tel"
            value={courierData?.api_key || ""}
            onChange={onChange}
            className="pl-4"
          />

          <Input
            label="Pickup Address"
            placeholder="Pickup Address"
            name="pickup_address"
            type="text"
            value={courierData?.pickup_address || ""}
            onChange={onChange}
            className="pl-4"
          />

          <Input
            label="Return Address"
            placeholder="Return Address"
            name="return_address"
            type="text"
            value={courierData?.return_address || ""}
            onChange={onChange}
            className="pl-4"
          />

          <Dropdown
            label="Status"
            name="status"
            value={courierData?.status ?? "Active"}
            onChange={onChange}
            className="pl-4"
            options={[
              {label: "Active", value: "Active"},
              {label: "Disabled", value: "Disabled"},
            ]}
          />
        </div>

        <div className="sm:col-span-2 flex justify-end items-center gap-[30px] max-w-[1110px] w-auto h-[36px]">
          <FormActionButtons onCancel={handleCancel} onSubmit={handleSubmit} />
        </div>
      </div>
    </>
  );
}

export default CourierForm;
