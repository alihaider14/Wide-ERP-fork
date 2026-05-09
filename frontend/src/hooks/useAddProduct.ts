import { handleApiError } from "@/helper/error-function";
import { generateBarcode } from "@/lib/utils";
import { ProductService } from "@/services";
import { TProduct } from "@/types/Products";
import { TError } from "@/types/TError";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const useAddProduct = () => {
	const navigate = useNavigate();
	const [productData, setProductData] = useState<Partial<TProduct>>({});

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

	useEffect(() => {
		setProductData((prev) => ({
			...prev,
			barcode: generateBarcode(),
		}));
	}, []);

	// Add Product Mutation
	const addProductMutation = useMutation({
		mutationFn: ProductService.addProduct,
		onSuccess: handleAddProductSuccess,
		onError: handleAddProductError,
	});

	const handleAddProduct = () => {
		addProductMutation.mutate(productData);
	};

	function handleAddProductSuccess() {
		toast.success("Product added successfully.");
		setProductData({});
		navigate("/products");
	}

	function handleAddProductError(error: TError) {
		handleApiError(error, "Failed to add product. Please try again.");
	}

	const handlePrintBarcode = () => {
		addProductMutation.mutate(productData, {
			onSuccess: (data) => {
				if (data) {
					navigate("/print-barcode", { state: { product: data?.product } });
				}
			},
			onError: handleAddProductError,
		});
	};
	const isLoading = addProductMutation.isPending;

	return {
		isLoading,
		productData,
		navigate,
		handleChange,
		handleAddProduct,
		handlePrintBarcode,
		setProductData,
	};
};
export default useAddProduct;
