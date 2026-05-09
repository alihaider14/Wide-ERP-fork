import { useNavigate } from "react-router-dom";
import { TShop } from "@/types/Shops";
import { useState } from "react";
import toast from "react-hot-toast";
import { addShop } from "@/services/shop-service";
import { handleApiError } from "@/helper/error-function";
import { TError } from "@/types/TError";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useAddShop = () => {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const [shopData, setShopData] = useState<Partial<TShop>>({});

	const handleChange =
		(setter: React.Dispatch<React.SetStateAction<Partial<TShop>>>) =>
		(event: React.ChangeEvent<HTMLInputElement>) => {
			const { name, value } = event.target;
			setter((prev) => ({
				...prev,
				[name]: value,
			}));
		};

	const { mutate: addShopMutate, isPending: isLoading } = useMutation({
		mutationFn: () => addShop(shopData),
		onSuccess: () => {
			toast.success("Shop added successfully!");
			queryClient.invalidateQueries({ queryKey: ["shop-keys"] });
			navigate("/shops");
		},
		onError: (error: TError) => {
			handleApiError(error, "Failed to add shop");
		},
	});

	const handleAddShop = () => {
		if (shopData?.name && shopData?.phone) {
			addShopMutate();
		} else {
			toast.error("Please fill the required fields");
		}
	};

	return {
		isLoading,
		shopData,
		setShopData,
		handleChange,
		handleAddShop,
		navigate,
	};
};

export default useAddShop;
