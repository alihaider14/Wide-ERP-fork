import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { createBill } from "../services/bill-service";
import type { BillCreateInput, BillItemInput } from "../types/bill";
import { TError } from "@/types/TError";
import { handleApiError } from "@/helper/error-function";
import { createBillSchema } from "@/validations/bill.schema";

const useAddBill = () => {
	const navigate = useNavigate();
	const [prompt, setPrompt] = useState(false);
	const [billData, setBillData] = useState<Partial<BillCreateInput>>({});
	const [items, setItems] = useState<BillItemInput[]>([]);
	const [loading, setLoading] = useState(false);

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

	const addBillMutation = useMutation({
		mutationFn: createBill,
		onSuccess: () => {
			toast.success("Bill added successfully.");
			setBillData({});
			setItems([]);
			setLoading(false);
			navigate("/bills");
		},
		onError: (error: TError) => {
			setLoading(false);
			handleApiError(error, "Failed to add bill. Please try again.");
		},
	});
	const handleAddBill = () => {
		const parseResult = createBillSchema.safeParse({
			vendor: billData.vendor || "",
			bill_date: billData.bill_date,
			items,
		});
		if (!parseResult.success) {
			toast.error(parseResult.error.errors[0]?.message || "Validation error");
			return;
		}

		setLoading(true);
		const sanitizedItems = items.map(
			({ product, sku, barcode, cost, qty, total_price }) => ({
				product,
				sku,
				barcode,
				cost,
				qty,
				total_price,
			}),
		);
		const now = new Date().toISOString();
		addBillMutation.mutate({
			...billData,
			bill_date: billData.bill_date ? format(billData.bill_date, "yyyy-MM-dd") : undefined,
			items: sanitizedItems,
			created_at: now,
			updated_at: now,
		} as BillCreateInput & { created_at: string; updated_at: string; bill_date?: string });
	};

	return {
		prompt,
		setPrompt,
		billData,
		setBillData,
		items,
		setItems,
		loading: loading || addBillMutation.isPending,
		handleChange,
		addItem,
		updateItem,
		removeItem,
		handleAddBill,
	};
};
export default useAddBill;
