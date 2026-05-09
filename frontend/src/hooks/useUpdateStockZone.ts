import { handleApiError } from "@/helper/error-function";
import { StockZoneService } from "@/services";
import { StockZoneData } from "@/components/custom/StockZoneForm";
import { TError } from "@/types/TError";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

const useUpdateStockZone = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [stockZoneData, setStockZoneData] = useState<Partial<StockZoneData>>(
		{},
	);

	const {
		data,
		error,
		isLoading: isLoadingStockZone,
	} = useQuery<Partial<StockZoneData>, TError>({
		queryKey: ["stock-zone", id],
		queryFn: async () => {
			return await StockZoneService.getStockZoneById(id as string);
		},
		enabled: !!id,
	});

	const handleChange =
		(setter: React.Dispatch<React.SetStateAction<Partial<StockZoneData>>>) =>
		(event: React.ChangeEvent<HTMLInputElement>) => {
			setter((prev: Partial<StockZoneData>) => ({
				...prev,
				[event.target.name]:
					event.target.value.trim() === "" ? undefined : event.target.value,
			}));
		};

	const updateStockZoneMutation = useMutation({
		mutationFn: async (data: Partial<StockZoneData>) => {
			return await StockZoneService.updateStockZone(id ?? "", data);
		},
		onSuccess: () => {
			toast.success("Stock zone updated successfully.");
			setLoading(false);
			setStockZoneData({});
			navigate("/stock-zone");
		},
		onError: (error: TError) => {
			setLoading(false);
			handleApiError(error, "Failed to update stock zone. Please try again.");
		},
	});

	useEffect(() => {
		if (data && Object.keys(data).length > 0) {
			setStockZoneData(data);
		}
		if (error) {
			handleApiError(error, "Failed to fetch stock zone data.");
		}
	}, [data, error]);

	const handleCancel = () => {
		setStockZoneData({});
	};

	const handleSubmit = () => {
		if (stockZoneData?.name) {
			setLoading(true);
			updateStockZoneMutation.mutate(stockZoneData);
		} else {
			toast.error("Please fill the required field");
		}
	};

	const isLoading =
		updateStockZoneMutation.isPending || loading || isLoadingStockZone;

	return {
		isLoading,
		stockZoneData,
		handleChange,
		setStockZoneData,
		handleCancel,
		handleSubmit,
		id: id || "",
	};
};
export default useUpdateStockZone;
