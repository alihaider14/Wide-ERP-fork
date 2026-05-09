import { useCallback, useMemo, useState } from "react";
import { useDebounce } from "./useDebounce";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getProducts } from "@/services/product-service";
import toast from "react-hot-toast";
import { AdjustQtyService, ProductService } from "@/services";
import { TError } from "@/types/TError";
import { handleApiError } from "@/helper/error-function";
import {
	TGetProductResponse,
	TProduct,
	TImportProductsResponse,
	TProductFilter,
	TPrintProducts,
} from "@/types/Products";
import {
	TImportAdjustQuantites,
	TImportProductsQuantitiesResponse,
} from "@/types/AdjustQty";
import { buildProductTableHead } from "@/helper/table-head";
import { PRODUCT_HEAD_DATA } from "@/constant/tableData";

const useProduct = () => {
	const [pageSize, setPageSize] = useState(10);
	const [search, setSearch] = useState("");
	const [pageNo, setPageNo] = useState(1);
	const [loading, setLoading] = useState(false);
	const [isImportProductModalOpen, setIsImportProductModalOpen] =
		useState(false);
	const [isImportQtyModalOpen, setImportQtyModalOpen] = useState(false);
	const [isSyncShopifyModalOpen, setIsSyncShopifyModalOpen] = useState(false);
	const [filters, setFilters] = useState<TProductFilter>();
	const [sortBy, setSortBy] = useState<"sku" | "price" | "qty" | undefined>();
	const [sortOrder, setSortOrder] = useState<"asc" | "desc" | undefined>();
	const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});
	const [printProductModalData, setPrintProductModalData] = useState<{
		open: boolean;
		data: Partial<TPrintProducts>[];
	}>({
		open: false,
		data: [],
	});

	const debounceSearch = useDebounce(search);

	const { data, error, isLoading, isError, refetch } = useQuery<
		TGetProductResponse,
		TError
	>({
		queryKey: [
			"products",
			pageNo,
			pageSize,
			filters,
			debounceSearch,
			sortBy,
			sortOrder,
		],
		queryFn: () =>
			getProducts(
				pageNo,
				pageSize,
				"active",
				filters,
				debounceSearch,
				sortBy,
				sortOrder,
			),
	});

	if (isError)
		handleApiError(error as unknown as TError, "Oops! something went wrong");

	const handleChangePageSize = (size: number) => {
		setPageSize(size);
		setPageNo(1);
	};

	const handleNextPage = () => {
		if (!data || pageNo >= data?.total_pages) return;
		setPageNo(pageNo + 1);
	};

	const handlePrevPage = () => {
		if (pageNo <= 1) return;

		setPageNo(pageNo - 1);
	};

	const handleLastPage = () => {
		if (!data || pageNo === data?.total_pages) return;

		setPageNo(data?.total_pages);
	};

	const handleFirstPage = () => {
		if (pageNo === 1) return;

		setPageNo(1);
	};

	const isPaginationData = data?.total_rows && data?.from && data?.to;

	const handleDeleteProduct = (id?: string) => {
		if (id) {
			setLoading(true);
			deleteProductMutation.mutate(id);
		}
	};

	const deleteProductMutation = useMutation({
		mutationFn: ProductService.deleteProduct,
		onSuccess: handleDeleteProductSuccess,
		onError: handleDeleteProductError,
	});

	function handleDeleteProductSuccess() {
		toast.success("Product deleted successfully.");
		refetch();
		setLoading(false);
	}

	function handleDeleteProductError(error: TError) {
		handleApiError(error, "Failed to delete Product. Please try again.");
		setLoading(false);
	}

	const handleUploadProducts = (products: Partial<TProduct>[]) => {
		if (products) {
			setLoading(true);
			uploadProductMutation.mutate(products);
		}
	};

	const uploadProductMutation = useMutation({
		mutationFn: ProductService.importProducts,
		onSuccess: handleUploadProductSuccess,
		onError: handleUploadProductError,
	});

	function handleUploadProductSuccess(data: TImportProductsResponse) {
		refetch();
		setLoading(false);
		if (data?.skipped_products?.length > 0) {
			let skippedMessage =
				"All other products have been uploaded successfully.\n";

			data.skipped_products?.forEach((item) => {
				if (item) skippedMessage += `${item}\n`;
			});

			toast.success(skippedMessage, {
				duration: 5000,
			});
		} else {
			toast.success("Products uploaded successfully.");
		}
	}

	function handleUploadProductError(error: TError) {
		handleApiError(error, "Failed to upload Products. Please try again.");
		setLoading(false);
	}

	const handleUploadProductsQuantities = (data: TImportAdjustQuantites[]) => {
		if (data) {
			setLoading(true);
			uploadProductsQuantitiesMutation.mutate(data);
		}
	};

	const uploadProductsQuantitiesMutation = useMutation({
		mutationFn: AdjustQtyService.importProductsQuantities,
		onSuccess: handleUploadProductsQuantitiesSuccess,
		onError: handleUploadProductsQuantitiesError,
	});

	function handleUploadProductsQuantitiesSuccess(
		data: TImportProductsQuantitiesResponse,
	) {
		refetch();
		setLoading(false);
		if (data?.data?.length > 0) {
			let skippedMessage =
				"All other products quantities have been uploaded successfully.\n";

			data.data?.forEach((item) => {
				if (item) skippedMessage += `${item}\n`;
			});

			toast.success(skippedMessage, {
				duration: 5000,
			});
		} else {
			toast.success("Products quantities uploaded successfully.");
		}
	}

	function handleUploadProductsQuantitiesError(error: TError) {
		handleApiError(
			error,
			"Failed to upload Products quantities. Please try again.",
		);
		setLoading(false);
	}

	const handleSyncShopify = (shopId: string) => {
		if (shopId) {
			setLoading(true);
			syncShopifyMutation.mutate({ shopId });
		}
	};

	const syncShopifyMutation = useMutation({
		mutationFn: ProductService.syncShopify,
		onSuccess: (data) => {
			toast(data.message);
			setLoading(false);
		},
		onError: (error: TError) => {
			handleApiError(error, "Failed to sync Shopify");
			setLoading(false);
		},
	});

	const handleReset = () => {
		setFilters(undefined);
		setSearch("");
		if (pageNo !== 1) setPageNo(1);
		refetch();
	};

	const handleFilters = (item: TProductFilter) => {
		if (item) {
			setFilters(item);
		}
	};

	const handleSort = (field: string) => {
		if (sortBy === field) {
			setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
		} else {
			setSortBy(field as "sku" | "price" | "qty" | undefined);
			setSortOrder("asc");
		}
		setPageNo(1);
	};

	const selectedCount = Object.values(selectedRows).filter(Boolean).length;
	const isRowSelected = (key: string) => !!selectedRows[key];
	const toggleRow = (key: string) => {
		setSelectedRows((prev) => ({ ...prev, [key]: !prev[key] }));
	};
	const allSelectedOnPage =
		data?.products &&
		data?.products?.length > 0 &&
		data?.products?.every((product) => selectedRows[product._id]);

	const toggleAllOnPage = useCallback(() => {
		const newSelected: Record<string, boolean> = { ...selectedRows };
		data?.products.forEach((product) => {
			newSelected[product._id] = !allSelectedOnPage;
		});
		setSelectedRows(newSelected);
	}, [data?.products, selectedRows, allSelectedOnPage]);

	const onPrintSelected = useCallback(() => {
		const selectedProducts: Partial<TPrintProducts>[] = [];

		data?.products.forEach((product) => {
			if (selectedRows[product._id]) {
				selectedProducts.push({
					name: product.name || product.sku,
					image: product.image as string,
				});
			}
		});

		setPrintProductModalData({
			open: true,
			data: selectedProducts,
		});
	}, [data?.products, selectedRows]);

	const productDynamicHeadData = useMemo(
		() =>
			buildProductTableHead(
				selectedCount,
				allSelectedOnPage || false,
				toggleAllOnPage,
				PRODUCT_HEAD_DATA,
				onPrintSelected,
			),
		[selectedCount, allSelectedOnPage, toggleAllOnPage],
	);

	return {
		isLoading,
		data,
		pageNo,
		pageSize,
		sortBy,
		sortOrder,
		setSortBy,
		setSortOrder,
		handleSort,
		search,
		loading,
		deleteProductMutation,
		isPaginationData,
		isImportProductModalOpen,
		isImportQtyModalOpen,
		isSyncShopifyModalOpen,
		PRODUCT_DYNAMIC_HEAD_DATA: productDynamicHeadData,
		handleNextPage,
		handlePrevPage,
		handleLastPage,
		handleChangePageSize,
		setSearch,
		handleDeleteProduct,
		handleFirstPage,
		setIsImportProductModalOpen,
		setImportQtyModalOpen,
		setIsSyncShopifyModalOpen,
		handleUploadProducts,
		handleSyncShopify,
		handleFilters,
		handleReset,
		handleUploadProductsQuantities,
		isRowSelected,
		toggleRow,
		setPrintProductModalData,
		printProductModalData,
	};
};
export default useProduct;
