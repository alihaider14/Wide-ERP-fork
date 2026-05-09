import {useState} from "react";
import {Button} from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import CustomAutocomplete from "./CustomAutocomplete";
import {getShopsIdAndName} from "@/services/shop-service";
import {useQuery} from "@tanstack/react-query";

type TProps = {
  open: boolean;
  handleSubmit: (shopId: string) => void;
  handleCancel: () => void;
};

const SyncShopifyModal = ({open, handleSubmit, handleCancel}: TProps) => {
  const [shopId, setShopId] = useState("");

  const {data: shops, isLoading} = useQuery({
    queryKey: ["shops-simple"],
    queryFn: getShopsIdAndName,
    enabled: !!open,
  });

  const onSubmit = () => {
    if (!shopId) return;
    handleSubmit(shopId);
    handleCancel();
    setShopId("");
  };

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        handleCancel();
      }}
    >
      <DialogContent className="w-110 sm:py-7.5 sm:px-5 py-3.75 px-5 gap-5">
        <DialogHeader className="text-center gap-5">
          <DialogTitle className="text-md">Select Shop</DialogTitle>
          <DialogDescription className="text-grey">
            Select shop, we’ll match the products with Shopify store and if we
            find new products, we’ll add them.
          </DialogDescription>
        </DialogHeader>
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
          value={shopId ?? ""}
          disabled={isLoading}
          handleSelect={(item) => setShopId(item.id)}
        />
        <Button onClick={onSubmit} disabled={!shopId} >
          Submit
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default SyncShopifyModal;
