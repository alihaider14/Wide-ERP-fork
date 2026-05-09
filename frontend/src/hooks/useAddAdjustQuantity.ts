import { handleApiError } from "@/helper/error-function";
import { AdjustQtyService } from "@/services";
import { TAdjustQty } from "@/types/AdjustQty";
import { TProduct } from "@/types/Products";
import { TError } from "@/types/TError";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import useAccessStore from "./useAccessStore";

const useAddAdjustQuantity = () => {
	const navigate = useNavigate();
	const { state } = useLocation();
	const [productQtyData, setProductQtyData] = useState<Partial<TAdjustQty>>({});
	const { userId } = useAccessStore((state) => state);

	if (!state?.product) navigate("/products");

	const { _id, sku } = state.product as TProduct;

	const handleChange =
		(setter: React.Dispatch<React.SetStateAction<Partial<TAdjustQty>>>) =>
		(event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
			setter((prev) => ({
				...prev,
				[event.target.name]: event.target.value,
			}));
		};

	const addAdjustQtyMutation = useMutation({
		mutationFn: AdjustQtyService.addAdjustQty,
		onSuccess: handleAddAdjustQtySuccess,
		onError: handleAddAdjustQtyError,
	});

	const handleAddAdjustQty = () => {
		addAdjustQtyMutation.mutate({
			...productQtyData,
			product_id: _id,
			created_by: userId as string,
		});
	};

	function handleAddAdjustQtySuccess() {
		toast.success("Product quantity adjusted successfully.");
		setProductQtyData({});
		navigate(`/adjust-quantities/${_id}`);
	}

	function handleAddAdjustQtyError(error: TError) {
		handleApiError(error, "Failed to add product quantity. Please try again.");
	}

	const isLoading = addAdjustQtyMutation.isPending;

	return {
		isLoading,
		productQtyData,
		sku,
		_id,
		setProductQtyData,
		handleChange,
		handleAddAdjustQty,
		navigate,
	};
};
export default useAddAdjustQuantity;
