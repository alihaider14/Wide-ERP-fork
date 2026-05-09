import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { getBillById, updateBill } from "../services/bill-service";
import useVendors from "./useVendors";
import {
	BillCreateInput,
	BillDetails,
	BillListItem,
	BillItemInput,
} from "../types/bill";
import { updateBillSchema } from "@/validations/bill.schema";

function useUpdateBill() {
	const { vendorsData: vendors, isTableLoader: vendorsLoading } = useVendors();
	const [billData, setBillData] = useState<Partial<BillCreateInput>>({ 
		vendor: "", 
		items: [] 
	});
	const [items, setItems] = useState<BillItemInput[]>([]);
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const {
		data: bill,
		isLoading: billLoading,
		error: billError,
	} = useQuery<BillDetails | undefined>({
		queryKey: ["bill", id],
		queryFn: () => getBillById(id!),
		enabled: !!id,
	});
	useEffect(() => {
		if (bill) {
			setBillData({
				vendor: bill.vendor_id,
				bill_date: bill.bill_date ? new Date(bill.bill_date) : undefined,
			});
			setItems(Array.isArray(bill.items) ? bill.items : []);
		}
	}, [bill]);

	const {
		mutate: updateBillMutate,
		status: updateStatus,
		error: updateError,
		isSuccess: updateSuccess,
	} = useMutation<BillListItem, Error, Partial<BillDetails>>({
		mutationFn: updateBill,
		onSuccess: () => {
			toast.success("Bill updated successfully.");
			queryClient.invalidateQueries({ queryKey: ["bill-list"] });
			navigate("/bills");
		},
	});
	const handleChange = <K extends keyof BillCreateInput>(
		field: K,
		value: BillCreateInput[K],
	) => {
		setBillData((prev) => ({ ...prev, [field]: value }));
	};
	const addItem = (item: BillItemInput) => {
		setItems((prev) => {
			if (!item?.product) return [...prev, item];

			const existingIndex = prev.findIndex((p) => p.product === item.product);
			if (existingIndex === -1) return [...prev, item];

			const existing = prev[existingIndex];
			const newQty = existing.qty + item.qty;

			const next = [...prev];
			const cost = isNaN(existing.cost) ? 0 : existing.cost;
			next[existingIndex] = {
				...existing,
				qty: newQty,
				remaining_qty: existing.remaining_qty !== undefined
					? existing.remaining_qty + item.qty
					: undefined,
				total_price: cost * newQty,
			};
			return next;
		});
	};
	const updateItem = (index: number, updated: Partial<BillItemInput>) => {
		setItems((prev) =>
			prev.map((item, i) => (i === index ? { ...item, ...updated } : item)),
		);
	};
	const removeItem = (index: number) => {
		setItems((prev) => prev.filter((_, i) => i !== index));
	};
	const handleSubmit = () => {
		if (!bill?._id || !bill?.bill_no) {
			return;
		}
		const parseResult = updateBillSchema.safeParse({
			_id: bill._id,
			bill_no: bill.bill_no,
			vendor: billData.vendor || "",
			bill_date: billData.bill_date,
			items,
		});
		if (!parseResult.success) {
			toast.error(parseResult.error.errors[0]?.message || "Validation error");
			return;
		}
		const vendorId =
			billData.vendor ||
			bill?.vendor_id ||
			"";
		updateBillMutate({
			...billData,
			_id: bill?._id,
			bill_no: bill.bill_no,
			vendor: vendorId,
			bill_date: billData.bill_date ? format(billData.bill_date, "yyyy-MM-dd") : undefined,
			items,
		} as Partial<BillDetails> & { bill_date?: string });
	};
	return {
		billData,
		setBillData,
		items,
		setItems,
		handleChange,
		addItem,
		updateItem,
		removeItem,
		handleSubmit,
		billLoading,
		billError,
		vendors,
		vendorsLoading,
		updateLoading: updateStatus === "pending",
		updateError,
		updateSuccess,
	};
}

export default useUpdateBill;
