import {handleApiError} from "@/helper/error-function";
import {TError} from "@/types/TError";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useState} from "react";
import toast from "react-hot-toast";
import {useNavigate} from "react-router-dom";
import {TCourier} from "@/types/Courier";
import {courierSchema} from "@/validations/courier.schema";
import {getShopsIdAndName} from "@/services/shop-service";
import {useQuery} from "@tanstack/react-query";
import {addCourier} from "@/services/courier-service";

const useAddCourier = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [courierData, setCourierData] = useState<Partial<TCourier>>({
    name: "",
    address_code: "",
    shop: "",
    api_key: "",
    status: "Active",
    pickup_address: "",
    return_address: "",
  });
  const {data: shops = [], isLoading: shopsLoading} = useQuery({
    queryKey: ["shops-simple"],
    queryFn: getShopsIdAndName,
  });

  const handleChange =
    (setter: React.Dispatch<React.SetStateAction<Partial<TCourier>>>) =>
      (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const {name, value} = event.target;

        setter((prev) => ({
          ...prev,
          [name]: value,
        }));
      };

  const addCourierMutation = useMutation({
    mutationFn: addCourier,
    onSuccess: handleAddCourierSuccess,
    onError: handleAddCourierError,
  });

  const handleAddCourier = (courierData: Partial<TCourier>) => {
    const parseResult = courierSchema.safeParse(courierData);
    if (parseResult.success) {
      setLoading(true);
      const payload =
        courierData.name === "PostEx"
          ? courierData
          : {...courierData, address_code: ""};
      addCourierMutation.mutate(payload);
    } else {
      toast.error(parseResult.error.errors[0]?.message || "Validation error");
    }
  };

  function handleAddCourierSuccess() {
    toast.success("Courier added successfully.");
    setLoading(false);
    setCourierData({
      name: "",
      address_code: "",
      shop: "",
      api_key: "",
      status: "Active",
      pickup_address: "",
      return_address: "",
    });
    queryClient.invalidateQueries({queryKey: ["couriers"]});
    navigate("/couriers");
  }

  function handleAddCourierError(error: TError) {
    setLoading(false);
    handleApiError(error, "Failed to add courier. Please try again.");
  }

  const handleCancel = () => {
    navigate("/couriers");
  };

  const isLoading = addCourierMutation.isPending || loading;

  return {
    isLoading,
    courierData,
    setCourierData,
    handleChange,
    handleAddCourier,
    handleCancel,
    shops,
    shopsLoading,
  };
};

export default useAddCourier;
