import { useState, useEffect, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
	getShopifyOrdersQueryFn,
	printOrders,
	updateShopifyOrderNote as updateShopifyOrderNoteService,
	updateShopifyOrderAddress as updateShopifyOrderAddressService,
	scanParcel,
	scanReturnParcel,
	bulkUpdateOrdersStatus,
} from "@/services/shopifyorders";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "./useDebounce";
import { TOrder, TOrdersPrompt } from "@/types/Order";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { OrderService } from "@/services";
import { TError } from "@/types/TError";
import { handleApiError } from "@/helper/error-function";
import useAccessStore from "./useAccessStore";
import { DateRange, getComputedStatus } from "@/helper/shopify-utils";
import { getShopKeys } from "@/services/shop-service";
import { getStartOfToday, getEndOfToday } from "@/helper/date-format";
import { BASE_HEAD } from "@/constant/tableData";
import { formatHumanDate } from "@/helper/human-date-format";
import { buildHead } from "@/helper/table-head";
import type {
	ShopifyRow,
	TPrintScannedOrder,
	TCursorsState,
	TScanParcel,
	TShopifyOrderByIdsBody,
} from "@/types/shopify";
import React from "react";
import useBulkActionsMenu from "@/hooks/useDropdownMenu";
import { getCouriersByShop } from "@/services/courier-service";
import useShopifyPdf from "./useShopifyPdf";
import { TPDFOrder } from "@/types/pdf";
import { Shop } from "@/types/shop";
import { TCourierBasic } from "@/types/Courier";

const useShopify = () => {
	const navigate = useNavigate();
	const [hoveredRow, setHoveredRow] = useState<string | null>(null);
	const [selectedShop, setSelectedShop] = useState<string>("");
	const [pageSize, setPageSize] = useState(50);
	const [search, setSearch] = useState("");
	const [pageNo, setPageNo] = useState(1);
	const [loading, setLoading] = useState(false);
	const [prompt, setPrompt] = useState<TOrdersPrompt>();
	const [cursors, setCursors] = useState<TCursorsState>({});
	const [orderItemsModal, setOrderItemsModal] = useState({
		open: false,
		_id: "",
	});
	const [dateRange, setDateRange] = useState<DateRange>({
		from: getStartOfToday(),
		to: getEndOfToday(),
	});
	const [historyModal, setHistoryModal] = useState({
		open: false,
		_id: "",
		order_no: 0,
	});

	const [lastScannedOrder, setLastScannedOrder] = useState<ShopifyRow | null>(
		null,
	);
	const [scanModal, setScanModal] = useState(false);
	const [activeStatus, setActiveStatus] = useState<string>("Pending");
	const [selectedCourier, setSelectedCourier] = useState<string>("");
	const [selectedCity, setSelectedCity] = useState<string>("");
	const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});
	const [noteOverrides, setNoteOverrides] = useState<Record<string, string>>(
		{},
	);

	useEffect(() => {
		setSelectedRows({});
	}, [activeStatus]);

	const HIDDEN_COLUMNS_BY_STATUS: Record<string, Set<string>> = {
		Pending: new Set(["Printed", "Tracking", "Ful. Status"]),
		"Ready to Ship": new Set(["Printed", "Tracking", "Ful. Status"]),
	};

	const hiddenColumns: Set<string> =
		HIDDEN_COLUMNS_BY_STATUS[activeStatus] ?? new Set();

	const [noteModal, setNoteModal] = useState<{
		open: boolean;
		rowKey: string;
		orderNo?: string;
		customer?: string;
		kind?: "note" | "destination" | "phone";
		initialValue?: string;
	}>({ open: false, rowKey: "" });
	const [destinationOverrides, setDestinationOverrides] = useState<
		Record<string, string>
	>({});
	const [activeNoteRow, setActiveNoteRow] = useState<string | null>(null);
	const [openDestinationFor] = useState<string | null>(null);
	const [addressModal, setAddressModal] = useState<{
		open: boolean;
		rowKey: string;
		orderNo?: string;
		customer?: string;
		initialValue?: string;
		initialAddress2?: string;
		initialZip?: string;
	}>({ open: false, rowKey: "" });

	const noteIndicatorRef = React.useRef<HTMLDivElement | null>(null);

	const queryClient = useQueryClient();
	const {
		handlePrintPackagingSlip,
		packagingSlipPdfRef,
		pdfData,
		handlePrintScannedOrder,
		printScannedOrderData,
		scannedOrderPdfRef,
	} = useShopifyPdf();

	useEffect(() => {
		if (!activeNoteRow) return;
		function handleClickOutside(event: MouseEvent) {
			if (
				noteIndicatorRef.current &&
				!noteIndicatorRef.current.contains(event.target as Node)
			) {
				setActiveNoteRow(null);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [activeNoteRow, setActiveNoteRow]);

	const { userId } = useAccessStore((state) => state);
	const debounceSearch = useDebounce(search);

	const updateShopifyOrderNote = useMutation({
		mutationFn: async ({
			storeId,
			orderId,
			note,
		}: {
			storeId: string;
			orderId: string;
			note: string;
		}) => {
			return updateShopifyOrderNoteService(storeId, orderId, note);
		},
		onSuccess: () => {
			toast.success("Order note updated successfully.");
			queryClient.invalidateQueries({ queryKey: ["shopify-orders"] });
		},
		onError: (error: TError) => {
			handleApiError(error, "Failed to update order note. Please try again.");
		},
	}).mutate;

	const updateShopifyOrderAddress = useMutation({
		mutationFn: async ({
			storeId,
			orderId,
			address,
		}: {
			storeId: string;
			orderId: string;
			address: object | string;
		}) => {
			return updateShopifyOrderAddressService(storeId, orderId, address);
		},
		onSuccess: () => {
			toast.success("Order address updated successfully.");
			queryClient.invalidateQueries({ queryKey: ["shopify-orders"] });
		},
		onError: (error: TError) => {
			const apiResponse = error?.response?.data;
			const details = apiResponse?.details;

			// If backend sent Shopify validation errors for shipping_address
			if (
				details?.shipping_address &&
				Array.isArray(details.shipping_address)
			) {
				toast.error(details.shipping_address[0]);
				return;
			}

			// If backend sent own validation errors (e.g., address format issues)
			if (details && typeof details === "object") {
				const firstKey = Object.keys(details)[0];
				const firstVal = (details as Record<string, string[]>)[firstKey];

				if (Array.isArray(firstVal) && firstVal.length) {
					toast.error(firstVal[0]);
					return;
				}
			}

			// Fallback
			handleApiError(
				error,
				"Failed to update order address. Please try again.",
			);
		},
	}).mutate;
	const {
		data: shopList = [],
		isLoading: isShopListLoading,
		isError: isShopListError,
		error: shopListError,
	} = useQuery({
		queryKey: ["shop-keys"],
		queryFn: getShopKeys,
	});

	const getSelectedShopIds = () => {
		if (!selectedShop || selectedShop === "All Shops") {
			return (shopList as Shop[]).map((shop) => shop._id);
		}
		const shopObj = (shopList as Shop[]).find(
			(shop) => shop.name === selectedShop || shop._id === selectedShop,
		);
		return shopObj ? [shopObj._id] : [];
	};

	const shopIds = getSelectedShopIds();
	const filterKey = `${shopIds.join(
		",",
	)}-${activeStatus}-${debounceSearch}-${pageSize}-${selectedCourier}-${selectedCity}`;
	const prevFilterKey = React.useRef(filterKey);

	if (prevFilterKey.current !== filterKey) {
		prevFilterKey.current = filterKey;
		if (pageNo !== 1) setPageNo(1);
		if (Object.keys(cursors).length > 0) setCursors({});
	}

	const {
		data: shopifyOrdersData,
		refetch: ordersRefetch,
		isLoading: isShopifyLoading,
		isFetching: isShopifyFetching,
	} = useQuery({
		queryKey: [
			"shopify-orders",
			shopIds,
			activeStatus,
			debounceSearch,
			pageNo,
			pageSize,
			selectedCourier,
			selectedCity,
		],
		queryFn: () =>
			getShopifyOrdersQueryFn(
				shopIds,
				activeStatus,
				debounceSearch,
				pageNo,
				pageSize,
				cursors,
				setCursors,
				selectedCourier || undefined,
				selectedCity || undefined,
			),
		enabled: !isShopListLoading && shopIds.length > 0,
	});

	const apiOrders: ShopifyRow[] = shopifyOrdersData?.orders || [];
	const totalRows = shopifyOrdersData?.total || 0;
	const hasNextPage = shopifyOrdersData?.hasNextPage ?? false;
	const hasPreviousPage = shopifyOrdersData?.hasPreviousPage ?? false;
	const totalPages = Math.ceil(totalRows / pageSize);

	const isCursorBased = true;

	const paginatedData: ShopifyRow[] = (() => {
		const mapped = apiOrders.map((order) => ({
			...order,
			date: formatHumanDate(order.date),
		}));
		if (!lastScannedOrder) return mapped;
		const computedTab = getComputedStatus(
			lastScannedOrder.wd_status,
			lastScannedOrder.delivery_status,
		);
		if (activeStatus && computedTab !== activeStatus) return mapped;
		const filtered = mapped.filter((o) => o.order !== lastScannedOrder.order);
		return [
			{ ...lastScannedOrder, date: formatHumanDate(lastScannedOrder.date) },
			...filtered,
		];
	})();

	const filteredOrders: ShopifyRow[] = paginatedData;
	const showShopColumn =
		!selectedShop || selectedShop === "All Shops" || selectedShop === "";
	const dynamicHead = React.useMemo(
		() =>
			BASE_HEAD.filter((h) =>
				showShopColumn ? true : h.title !== "Shop",
			).filter((h) => !hiddenColumns.has(h.title)),
		[showShopColumn, hiddenColumns],
	);

	const statusFilteredOrders: ShopifyRow[] = filteredOrders;
	const selectedCount = Object.values(selectedRows).filter(Boolean).length;
	const isRowSelected = (key: string) => !!selectedRows[key];
	const toggleRow = (key: string) => {
		setSelectedRows((prev) => ({ ...prev, [key]: !prev[key] }));
	};
	const allSelectedOnPage =
		statusFilteredOrders.length > 0 &&
		statusFilteredOrders?.every(
			(order, idx) => selectedRows[`${order.order}-${idx}`],
		);

	const toggleAllOnPage = useCallback(() => {
		const newSelected: Record<string, boolean> = { ...selectedRows };
		statusFilteredOrders.forEach((order, idx) => {
			newSelected[`${order.order}-${idx}`] = !allSelectedOnPage;
		});
		setSelectedRows(newSelected);
	}, [allSelectedOnPage, selectedRows, statusFilteredOrders]);

	const getPrintOrdersMutation = useMutation({
		mutationFn: printOrders,
		onSuccess: handleGetShgetPrintOrdersSuccess,
		onError: handleGetShgetPrintOrdersError,
	});

	function handleGetShgetPrintOrdersSuccess(data: TPDFOrder[]) {
		if (data) {
			toast.dismiss();
			handlePrintPackagingSlip(data);
			ordersRefetch();
		}
	}

	function handleGetShgetPrintOrdersError(error: TError) {
		handleApiError(error, "Failed to generate PDF. please try again.");
	}

	const handlePrintSelected = useCallback(() => {
		const data: TShopifyOrderByIdsBody = [];

		statusFilteredOrders.forEach((order, idx) => {
			const rowKey = `${order.order}-${idx}`;
			if (selectedRows[rowKey]) {
				data.push({
					shopId: order.shopId,
					orderId: order.orderId,
				});
			}
		});

		toast.loading("Generating PDF...");

		getPrintOrdersMutation.mutate(data);
	}, [getPrintOrdersMutation, selectedRows, statusFilteredOrders]);

	const isSingleShop = shopIds.length === 1;
	const { data: couriers = [] } = useQuery({
		queryKey: ["couriers-by-shop", shopIds[0]],
		queryFn: () =>
			isSingleShop && shopIds[0] ? getCouriersByShop(shopIds[0]) : [],
		enabled: isSingleShop && !!shopIds[0],
	});

	const handleBookCourier = useCallback(
		(courier: TCourierBasic) => {
			if (selectedCount === 0) {
				toast.error("Please select at least one order.");
				return;
			}
			const selected = statusFilteredOrders.filter(
				(_, idx) => selectedRows[`${_.order}-${idx}`],
			);
			navigate("/book-at-courier", {
				state: { orders: selected, courier },
			});
		},
		[selectedCount, selectedRows, statusFilteredOrders, navigate],
	);

	const printScannedOrders = useCallback(() => {
		const data: TPrintScannedOrder = {};

		statusFilteredOrders.forEach((order, idx) => {
			const rowKey = `${order.order}-${idx}`;

			if (selectedRows[rowKey] && order.tracking) {
				data[order.shop] ??= [];
				data[order.shop].push(order.tracking);
			}
		});

		handlePrintScannedOrder(data);

		toast.loading("Generating PDF...");
	}, [selectedRows, statusFilteredOrders, handlePrintScannedOrder]);

	const { mutate: bulkReadyToShipMutate, isPending: isReadyToShipPending } =
		useMutation({
			mutationFn: () => {
				const orders = statusFilteredOrders
					.filter((_, idx) => selectedRows[`${_.order}-${idx}`])
					.map((o) => ({ shopId: o.shopId, orderId: o.orderId }));
				return bulkUpdateOrdersStatus(orders, "Ready to Ship");
			},
			onSuccess: () => {
				toast.success("Orders marked as Ready to Ship.");
				setSelectedRows({});
				ordersRefetch();
			},
			onError: (error: TError) => {
				handleApiError(error, "Failed to update orders. Please try again.");
			},
		});

	const handleReadyToShip = useCallback(() => {
		if (selectedCount === 0) {
			toast.error("Please select at least one order.");
			return;
		}
		bulkReadyToShipMutate();
	}, [bulkReadyToShipMutate, selectedCount]);

	const handleMergeOrder = useCallback(() => {
		const selected = statusFilteredOrders.filter(
			(_, idx) => selectedRows[`${_.order}-${idx}`],
		);

		if (selected.length !== 2) {
			toast.error("Please select 2 orders only.");
			return;
		}

		navigate(`/merge-shopify-orders`, {
			state: {
				shopId: selected?.[0]?.shopId,
				orderIds: selected.map((item) => item.orderId),
				orderName: selected.map((item) => item?.order),
			},
		});
	}, [selectedRows, statusFilteredOrders, navigate]);

	useEffect(() => {
		setSelectedShop(shopList?.[0]?.name);
	}, [shopList]);

	const bulkMenu = useBulkActionsMenu();
	const selectionActive = selectedCount >= 1;
	const activeHead = React.useMemo(
		() =>
			buildHead(
				selectionActive,
				selectedCount,
				allSelectedOnPage,
				toggleAllOnPage,
				dynamicHead,
				handleMergeOrder,
				bulkMenu,
				handlePrintSelected,
				couriers,
				isSingleShop,
				handleBookCourier,
				activeStatus === "Scanned" ? printScannedOrders : undefined,
				handleReadyToShip,
				activeStatus,
				isReadyToShipPending,
			),
		[
			selectionActive,
			selectedCount,
			allSelectedOnPage,
			toggleAllOnPage,
			dynamicHead,
			couriers,
			isSingleShop,
			handleBookCourier,
			bulkMenu,
			activeStatus,
			handlePrintSelected,
			printScannedOrders,
			handleReadyToShip,
			activeStatus,
			isReadyToShipPending,
		],
	);

	const handleChangePageSize = (size: number) => {
		setPageSize(size);
		setPageNo(1);
		setCursors({});
	};

	const handleNextPage = () => {
		if (isCursorBased) {
			if (!hasNextPage) {
				return;
			}
			setPageNo(pageNo + 1);
		} else {
			if (pageNo >= totalPages) {
				return;
			}
			setPageNo(pageNo + 1);
		}
	};

	const handlePrevPage = () => {
		if (pageNo <= 1) return;
		setPageNo(pageNo - 1);
	};

	const handleLastPage = () => {
		if (isCursorBased) {
			if (hasNextPage) {
				setPageNo(pageNo + 1);
			}
		} else {
			if (pageNo === totalPages) return;
			setPageNo(totalPages);
		}
	};

	const handleFirstPage = () => {
		if (pageNo === 1) return;
		setPageNo(1);
	};

	const handleOpenPrompt = (data: Partial<TOrder>) => {
		setPrompt({
			data,
			open: true,
		});
	};

	const handleCancelPrompt = () => {
		setPrompt({
			data: {},
			open: false,
		});
	};

	const handleSumbitPrompt = () => {
		if (prompt?.data?._id && prompt?.data?.status) {
			setLoading(true);
			handleCancelPrompt();
			updateStatusMutation.mutate({
				_id: prompt?.data?._id,
				status: prompt?.data?.status === "cancelled" ? "drafted" : "cancelled",
				user_id: userId!,
			});
		}
	};

	const updateStatusMutation = useMutation({
		mutationFn: OrderService.updateOrderStatus,
		onSuccess: handleUpdateStatusSuccess,
		onError: handleUpdateStatusError,
	});

	function handleUpdateStatusSuccess() {
		toast.success("Order status updated successfully.");
		ordersRefetch();
		setLoading(false);
	}

	function handleUpdateStatusError(error: TError) {
		handleApiError(error, "Failed to update order status. Please try again.");
		setLoading(false);
	}

	const handleScan = (data: TScanParcel) => {
		setScanModal(false);

		toast.loading("Processing parcel...", {
			id: "scan-parcel",
			duration: Infinity,
		});

		if (activeStatus === "Rec. Return") {
			scanReturnMutation(data);
		} else {
			scanParcelMutation(data);
		}
	};

	const { mutate: scanParcelMutation, isPending: isScanning } = useMutation({
		mutationFn: scanParcel,
		onSuccess: handleScanParcelSuccess,
		onError: handleScanParcelError,
	});

	const { mutate: scanReturnMutation } = useMutation({
		mutationFn: scanReturnParcel,
		onSuccess: handleReturnSuccess,
		onError: handleScanReturnError,
	});

	function handleScanSuccess(
		data: { orderNo: string; order?: ShopifyRow },
		message: string,
	) {
		toast.success(message, { id: "scan-parcel", duration: 4000 });
		if (data.order) setLastScannedOrder(data.order);
		setTimeout(() => {
			ordersRefetch().then((result) => {
				const orders = result.data?.orders || [];
				if (orders.some((o: ShopifyRow) => o.order === data.orderNo)) {
					setLastScannedOrder(null);
				}
			});
		}, 4000);
	}

	function handleScanParcelSuccess(data: {
		orderNo: string;
		order?: ShopifyRow;
	}) {
		handleScanSuccess(
			data,
			`Order ${data.orderNo} has been scanned successfully.`,
		);
	}

	function handleScanParcelError(error: TError) {
		toast.dismiss("scan-parcel");
		handleApiError(error, "Failed to scan parcel. Please try again.");
		setScanModal(true);
	}

	function handleScanReturnError(error: TError) {
		toast.dismiss("scan-parcel");
		handleApiError(error, "Failed to process return. Please try again.");
		setScanModal(true);
	}

	function handleReturnSuccess(data: { orderNo: string; order?: ShopifyRow }) {
		handleScanSuccess(
			data,
			`Return parcel ${data.orderNo} processed successfully.`,
		);
	}

	const isTableLoader = loading || isShopListLoading || isShopifyLoading;
	const isCustomerLoader = loading || updateStatusMutation?.isPending;

	const clearSelection = () => setSelectedRows({});

	return {
		search,
		isCustomerLoader,
		isTableLoader,
		pageNo,
		pageSize,
		prompt,
		orderItemsModal,
		dateRange,
		historyModal,
		navigate,
		setSearch,
		handleNextPage,
		handlePrevPage,
		handleLastPage,
		handleChangePageSize,
		handleFirstPage,
		handleOpenPrompt,
		handleCancelPrompt,
		handleSumbitPrompt,
		setOrderItemsModal,
		setDateRange,
		setHistoryModal,
		paginatedData,
		totalRows,
		totalPages,
		hasNextPage,
		hasPreviousPage,
		isCursorBased,
		hoveredRow,
		setHoveredRow,
		selectedShop,
		setSelectedShop,
		shopList,
		isShopListLoading,
		isShopListError,
		shopListError,
		filteredOrders,
		showShopColumn,
		DYNAMIC_HEAD: dynamicHead,
		activeStatus,
		setActiveStatus,
		statusFilteredOrders,
		selectedCount,
		isRowSelected,
		toggleRow,
		allSelectedOnPage,
		toggleAllOnPage,
		selectionActive,
		ACTIVE_HEAD: activeHead,
		noteOverrides,
		setNoteOverrides,
		noteModal,
		setNoteModal,
		destinationOverrides,
		setDestinationOverrides,
		openDestinationFor,
		activeNoteRow,
		setActiveNoteRow,
		updateShopifyOrderNote,
		updateShopifyOrderAddress,
		packagingSlipPdfRef,
		pdfData,
		isShopifyLoading,
		isShopifyFetching,
		setScanModal,
		scanModal,
		handleScan,
		addressModal,
		setAddressModal,
		noteIndicatorRef,
		isScanning,
		printScannedOrderData,
		scannedOrderPdfRef,
		couriers,
		selectedCourier,
		setSelectedCourier,
		selectedCity,
		setSelectedCity,
		hiddenColumns,
		clearSelection,
	};
};
export default useShopify;
