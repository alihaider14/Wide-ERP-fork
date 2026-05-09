import { useState, useEffect } from "react";
import { TShop } from "@/types/Shops";
import toast from "react-hot-toast";
import { updateShop } from "@/services/shop-service";

import { shopById } from "@/services/shop-service";
import { handleApiError } from "@/helper/error-function";
import { TError } from "@/types/TError";

const useUpdateShop = (shopId?: string) => {
	const [loading, setLoading] = useState(false);
	const [shopData, setShopData] = useState<Partial<TShop>>({});

	useEffect(() => {
		if (shopId) {
			setLoading(true);
			shopById(shopId)
				.then((data) => setShopData(data.shop))
				.finally(() => setLoading(false));
		}
	}, [shopId]);

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target;
		setShopData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleUpdateShop = async (navigate: (path: string) => void) => {
		if (shopData?.name && shopData?.phone && shopData?._id) {
			setLoading(true);
			try {
				await updateShop(shopData);
				toast.success("Shop updated successfully!");
				navigate("/shops");
			} catch (err) {
				handleApiError(err as TError, "Failed to update shop");
			} finally {
				setLoading(false);
			}
		} else {
			toast.error("Please fill the required fields");
		}
	};

	return {
		isLoading: loading,
		shopData,
		setShopData,
		handleChange,
		handleUpdateShop,
	};
};
export default useUpdateShop;
