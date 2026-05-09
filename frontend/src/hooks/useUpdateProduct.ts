import { handleApiError } from "@/helper/error-function";
import { ProductService } from "@/services";
import { TProduct } from "@/types/Products";
import { TError } from "@/types/TError";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

const useUpdateProduct = () => {
	const navigate = useNavigate();
	const { id } = useParams();
	const [loading, setLoading] = useState(false);
	const [productData, setProductData] = useState<Partial<TProduct>>({});

	const { data, isLoading: isProductByIdLoading } = useQuery({
		queryKey: [`productById/${id}`, id],
		queryFn: () => ProductService.productById(id),
		enabled: !!id,
	});

	useEffect(() => {
		if (data) {
			setProductData(data?.product);
		}
	}, [data]);

	const handleChange =
		(setter: React.Dispatch<React.SetStateAction<Partial<TProduct>>>) =>
		(event: React.ChangeEvent<HTMLInputElement>) => {
			if (event.target.type === "file") {
				setter((prev) => ({
					...prev,
					[event.target.name]: event.target.files?.[0] as File,
				}));
			} else
				setter((prev) => ({
					...prev,
					[event.target.name]: event.target.value,
				}));
		};

	// Update Product Mutation
	const updateProductMutation = useMutation({
		mutationFn: ProductService.updateProduct,
		onSuccess: handleUpdateProductSuccess,
		onError: handleUpdateProductError,
	});

	const handleUpdateProduct = () => {
		if (productData?.sku && productData?.barcode && productData?.price && id) {
			setLoading(true);
			updateProductMutation.mutate(productData);
		} else {
			toast.error("Please fill the required field");
		}
	};

	function handleUpdateProductSuccess() {
		toast.success("Product updated successfully.");
		setLoading(false);
		setProductData({});
		navigate("/products");
	}

	function handleUpdateProductError(error: TError) {
		setLoading(false);
		handleApiError(error, "Failed to update Product. Please try again.");
	}

	const handlePrintBarcode = () => {
		if (productData?.sku && productData?.barcode && productData?.price) {
			setLoading(true);
			updateProductMutation.mutate(productData, {
				onSuccess: (data) => {
					if (data) {
						navigate("/print-barcode", { state: { product: data?.product } });
					}
				},
				onError: handleUpdateProductError,
			});
		} else {
			toast.error("Please fill the required fields.");
		}
	};

	const isLoading =
		updateProductMutation.isPending || loading || isProductByIdLoading;

	return {
		isLoading,
		productData,
		navigate,
		handleChange,
		handleUpdateProduct,
		handlePrintBarcode,
		setProductData,
		apiData: data?.product,
	};
};
export default useUpdateProduct;
