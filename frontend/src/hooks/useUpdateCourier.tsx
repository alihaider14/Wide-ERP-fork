import {updateCourierSchema} from "@/validations/courier.schema";
import {handleApiError} from "@/helper/error-function";
import {CourierService} from "@/services";
import {TCourier} from "@/types/Courier";
import {TError} from "@/types/TError";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {getShopsIdAndName} from "@/services/shop-service";
import {useEffect, useState} from "react";
import toast from "react-hot-toast";
import {useNavigate, useParams} from "react-router-dom";
import {updateCourier} from "@/services/courier-service";

const useUpdateCourier = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const {id} = useParams();
  const [loading, setLoading] = useState(false);
  const [courierData, setCourierData] = useState<
    Partial<TCourier & {_id?: string}>
  >({
    name: "",
    address_code: "",
    shop: "",
    api_key: "",
    status: "Active",
    pickup_address: "",
    return_address: "",
  });

  const {data, isLoading: isCourierByIdLoading} = useQuery({
    queryKey: [`courierById/${id}`, id],
    queryFn: () => CourierService.getCourierById(id as string),
    enabled: !!id,
  });

  const {data: shops = [], isLoading: shopsLoading} = useQuery({
    queryKey: ["shops-simple"],
    queryFn: getShopsIdAndName,
  });

  useEffect(() => {
    if (data) {
      setCourierData((prev) => ({
        ...prev,
        ...data,
        shop: data.shop_id || data.shop || "",
      }));
    }
  }, [data]);

  const handleChange =
    (setter: React.Dispatch<React.SetStateAction<Partial<TCourier>>>) =>
      (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const {name, value} = event.target;
        setter((prev) => ({
          ...prev,
          [name]: value,
        }));
      };

  const updateCourierMutation = useMutation({
    mutationFn: updateCourier,
    onSuccess: handleUpdateCourierSuccess,
    onError: handleUpdateCourierError,
  });

  const handleUpdateCourier = () => {
    const parseResult = updateCourierSchema.safeParse(courierData);
    if (parseResult.success) {
      setLoading(true);
      const payload =
        courierData.name === "PostEx"
          ? {...courierData}
          : (() => {
              const {address_code, ...rest} = courierData;
            return rest;
          })();

      updateCourierMutation.mutate({
        ...payload,
        _id: id,
      } as TCourier & {_id: string});
    } else {
      toast.error(parseResult.error.errors.map((e) => e.message).join(", "));
    }
  };

  function handleUpdateCourierSuccess() {
    toast.success("Courier updated successfully.");
    setLoading(false);
    setCourierData({
      name: "",
      shop: "",
      api_key: "",
      status: "Active",
      pickup_address: "",
      return_address: "",
    });
    queryClient.invalidateQueries({queryKey: ["couriers"]});
    navigate("/couriers");
  }

  function handleUpdateCourierError(error: TError) {
    setLoading(false);
    handleApiError(error, "Failed to update courier. Please try again.");
  }

  const handleCancel = () => {
    navigate("/couriers");
  };

  const isLoading =
    updateCourierMutation.isPending || loading || isCourierByIdLoading;

  return {
    isLoading,
    courierData,
    setCourierData,
    handleChange,
    handleUpdateCourier,
    handleCancel,
    shops,
    shopsLoading,
  };
};

export default useUpdateCourier;
