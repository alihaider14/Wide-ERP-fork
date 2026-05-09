import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQueries, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { bookAtCourier, getShopifyOrdersByOrderIds } from "@/services/shopifyorders";
import { getCourierCities } from "@/services/courier-service";
import { handleApiError } from "@/helper/error-function";
import type { ShopifyRow } from "@/types/shopify";
import type { TBookingRow, TCourierBasic } from "@/types/Courier";
import type { TError } from "@/types/TError";

const useBookAtCourier = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { orders = [], courier } = (location.state || {}) as {
    orders: ShopifyRow[];
    courier: TCourierBasic;
  };

  const [rows, setRows] = useState<TBookingRow[]>([]);

  useEffect(() => {
    return setRows(
      orders.map((o, idx) => ({
        id: `${o.order}-${idx}`,
        rowKey: `${o.order}-${idx}`,
        order: o.order,
        items: o.items,
        name: o.customer || "",
        phone: o.phone || "",
        address: o.destination || "",
        city: o.city?.toUpperCase() || "",
        cod: o.total || "",
        kg: "0.3",
        type: "Normal",
        remarks: "",
        selected: true,
        originalOrder: o,
      }))
    );
  }, []);

  const {
    data: cities = [],
    isLoading: citiesLoading,
    isError: isCitiesError,
  } = useQuery({
    queryKey: ["courier-cities", courier?._id],
    queryFn: () => getCourierCities(courier._id),
    enabled: !!courier?._id,
  });

  useEffect(() => {
    if (isCitiesError) toast.error("Failed to load cities for this courier.");
  }, [isCitiesError]);

  const [remarksModal, setRemarksModal] = useState<{
    open: boolean;
    rowId: string;
    orderId: string;
    value: string;
  }>({ open: false, rowId: "", orderId: "", value: "" });

  const openRemarksModal = (row: TBookingRow) => {
    setRemarksModal({ open: true, rowId: row.id, orderId: row.order, value: row.remarks ?? "" });
  };

  const closeRemarksModal = () => {
    setRemarksModal({ open: false, rowId: "", orderId: "", value: "" });
  };

  const handleSaveRemarks = () => {
    updateRow(remarksModal.rowId, "remarks", remarksModal.value);
    closeRemarksModal();
  };

  const selectedCount = rows.filter((r) => r.selected).length;
  const allSelected = rows.length > 0 && rows.every((r) => r.selected);
  const someSelected = rows.some((r) => r.selected) && !allSelected;

  const toggleAll = () => {
    setRows((prev) => prev.map((r) => ({ ...r, selected: !allSelected })));
  };

  const toggleRow = (id: string) => {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, selected: !r.selected } : r))
    );
  };

  const updateRow = (id: string, field: keyof TBookingRow, value: string) => {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  const bookMutation = useMutation({
    mutationFn: bookAtCourier,
    onSuccess: (data) => {
      toast.dismiss("book-courier");
      const message = data.message || "Courier booking completed.";
      if (data.failedOrders === data.totalOrders) toast.error(message);
      else if (data.warning) toast(message);
      else toast.success(message);
      navigate("/shopify")
    },
    onError: (error: TError) => {
      toast.dismiss("book-courier");
      handleApiError(error, `Failed to book ${courier?.name} for selected orders.`);
    },
  });

  const handleUploadBooking = () => {
    if (selectedCount === 0) {
      toast.error("Please select at least one order.");
      return;
    }

    const selectedRows = rows.filter((r) => r.selected);
    const shopId = selectedRows[0]?.originalOrder.shopId;

    const payload = {
      shop_id: shopId,
      courier_id: courier._id,
      orders: selectedRows.map((r) => ({
        orderId: r.originalOrder.orderId,
        name: r.name,
        phone: r.phone,
        address: r.address,
        city: r.city,
        cod: r.cod,
        kg: r.kg,
        type: r.type,
        items: r.items,
        remarks: r.remarks || "",
      })),
    };

    toast.loading("Booking courier...", { id: "book-courier" });

    bookMutation.mutate(payload);

    console.log("payload: ", payload);
  };

  const shopId = orders[0]?.shopId;
  const orderIds = orders.map((o) => o.orderId);

  // Split orderIds into chunks of 10
  const chunkArray = <T,>(arr: T[], size: number): T[][] =>
    Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
      arr.slice(i * size, i * size + size)
    );

  const orderIdChunks = chunkArray(orderIds, 10);

  const chunkQueries = useQueries({
    queries: orderIdChunks.map((chunk) => ({
      queryKey: ["book-courier-full-orders", chunk],
      queryFn: () => getShopifyOrdersByOrderIds(shopId, chunk),
      enabled: chunk.length > 0 && !!shopId,
    })),
  });

  const fullOrders = chunkQueries
    .filter((q) => q.isSuccess && q.data)
    .flatMap((q) => q.data!);

  // Merge shippingRemarks into rows once full orders load
  const allChunksSettled = chunkQueries.every((q) => q.isSuccess || q.isError);

  useEffect(() => {
    if (!allChunksSettled || fullOrders.length === 0) return;
    setRows((prev) =>
      prev.map((row) => {
        const match = fullOrders.find((o) => {
          const numericId = o.orderId.split("/").pop();
          const originalOrder = orders.find((or) => or.order === row.order);
          return numericId === originalOrder?.orderId;
        });
        return match ? { ...row, remarks: match.shippingRemarks || "" } : row;
      })
    );
  }, [allChunksSettled, fullOrders.length]);

  return {
    courier,
    rows,
    cities,
    citiesLoading,
    remarksModal,
    setRemarksModal,
    openRemarksModal,
    closeRemarksModal,
    handleSaveRemarks,
    selectedCount,
    allSelected,
    someSelected,
    toggleAll,
    toggleRow,
    updateRow,
    handleUploadBooking,
    isBookingPending: bookMutation.isPending,
  };
};

export default useBookAtCourier;