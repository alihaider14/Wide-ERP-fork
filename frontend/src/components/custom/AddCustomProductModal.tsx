import { SHOPIFY_PRODUCT_DATA_CUSTOM } from "@/constant/tableData";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import SimpleTable from "./SimpleTable";
import { TableCell, TableRow } from "../ui/table";
import { CloseIcon, PhotoIcon, Trash } from "@/assets/svg";
import { Input } from "../ui/input";
import { useEffect, useState } from "react";

import { Button } from "../ui/button";
import { handleApiError } from "@/helper/error-function";
import { TError } from "@/types/TError";
import { getProducts } from "@/services/product-service";
import { useDebounce } from "@/hooks/useDebounce";
import { ScaleLoader } from "react-spinners";
import { COLOR } from "@/constant/Colors";
import SearchInput from "./SearchInput";
import { useQuery } from "@tanstack/react-query";
import { TShopifyProduct } from "@/types/shopify";
import { TableIcon } from "..";
import { TProduct } from "@/types/Products";
import toast from "react-hot-toast";

type TProps = {
	open: boolean;
	handleCancel?: () => void;
	handleSumbit: (product: Partial<TShopifyProduct>[]) => void;
};

const AddCustomProductModal = ({
	open,
	handleCancel,
	handleSumbit,
}: TProps) => {
	const [search, setSearch] = useState("");
	const [isFocused, setIsFocused] = useState(false);
	const [selectedIndex, setSelectedIndex] = useState(0);
	const [product, setProduct] = useState<Partial<TShopifyProduct>[]>([]);

	const debounceSearch = useDebounce(search);

	const {
		data: availableProducts,
		error,
		isLoading,
		isError,
	} = useQuery({
		queryKey: ["productsForOrder", 1, 10, undefined, debounceSearch],
		queryFn: () => getProducts(1, 10, "active", undefined, debounceSearch),
		enabled: !!isFocused && Boolean(debounceSearch.length > 2),
	});

	if (isError)
		handleApiError(error as unknown as TError, "Oops! something went wrong");

	const addProduct = (product?: TProduct) => {
		const actualQty = product?.qty || 0;

		if (actualQty <= 0) {
			toast.error(`${product?.sku} is out of stock`);
			return;
		}

		setProduct((prev) => {
			const existingIndex = prev.findIndex((p) => p.sku === product?.sku);

			if (existingIndex !== -1) {
				const updated = [...prev];

				const currentQty = Number(updated[existingIndex].qty || 0);

				const updatedQty =
					currentQty + 1 > actualQty ? currentQty : currentQty + 1;

				updated[existingIndex] = {
					...updated[existingIndex],
					qty: updatedQty,
					actualQty,
				};

				return updated;
			}

			return [
				...prev,
				{
					sku: product?.sku,
					price: String(product?.price),
					qty: 1,
					name: product?.name,
					image: product?.image as string,
					actualQty,
				},
			];
		});
	};

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (!isFocused || availableProducts?.products.length === 0) return;

			if (e.key === "ArrowDown") {
				setSelectedIndex((prevIndex) =>
					prevIndex < availableProducts!.products.length - 1
						? prevIndex + 1
						: 0,
				);
			} else if (e.key === "ArrowUp") {
				setSelectedIndex((prevIndex) =>
					prevIndex > 0
						? prevIndex - 1
						: availableProducts!.products.length - 1,
				);
			} else if (e.key === "Enter") {
				const product = availableProducts?.products[selectedIndex];
				if (product) addProduct(product);
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [isFocused, selectedIndex, availableProducts]);

	const handleProductChange = (
		index: number,
		value: string,
		name: keyof TShopifyProduct,
	) => {
		const updatedProducts = [...product];

		updatedProducts[index] = {
			...updatedProducts[index],
			[name]: name === "qty" ? Number(value) : value,
		};

		setProduct(updatedProducts);
	};

	const handleDeleteProduct = (index: number) => {
		setProduct(product.filter((_, i) => i !== index));
	};

	const totalAmount = product.reduce(
		(total, item) => total + Number(item.price) * Number(item.qty),
		0,
	);

	return (
		<Dialog open={open} onOpenChange={handleCancel}>
			<DialogContent
				onClose={handleCancel}
				className='w-full sm:max-w-[80vw] max-h-[80vh] p-0 gap-0  flex flex-col rounded-[5px] border-0'
				aria-describedby={undefined}
				isCrossIcon={false}
			>
				<DialogTitle className='h-10 py-3 px-5 bg-secondary-grey'>
					Add Custom Product
				</DialogTitle>

				<div className='h-[60px] py-3 px-5  flex items-center justify-center bg-secondary-grey relative border-t  border-border'>
					<SearchInput
						value={search || ""}
						onChange={(e) => setSearch(e.target.value)}
						placeholder='Search product by SKU or Barcode'
						className='w-full'
						isFocusButtons
						onFocus={() => setIsFocused(true)}
						onBlur={() => setTimeout(() => setIsFocused(false), 200)}
					/>

					<div
						className={`absolute flex flex-col left-5 md:left-10  top-14 lg:min-h-[600px] w-[80%] lg:max-w-[650px] border-border border shadow-[0_4px_8px_3px] shadow-shadow rounded-[5px] bg-white z-50  overflow-auto
					transition-all duration-300 ${
						Boolean(debounceSearch.length > 2) && isFocused
							? "opacity-100 scale-y-100"
							: "opacity-0 scale-y-0"
					}
				`}
						onMouseDown={(e) => e.preventDefault()}
					>
						{isLoading ? (
							<div className='w-full h-full flex items-center justify-center flex-1 p-5 md:p-10'>
								<ScaleLoader loading={isLoading} color={COLOR.blue} />
							</div>
						) : availableProducts && availableProducts?.products?.length > 0 ? (
							availableProducts?.products?.map((item, index) => {
								return (
									<div
										className={`flex items-center justify-between px-5 md:px-10 min-h-[60px] last:border-b-0 last:lg:border-b border-b border-border group gap-5 py-2 transition-all 
										${selectedIndex === index ? "bg-muted/50 " : "hover:bg-muted/50"}
									`}
										key={index}
										onClick={() => addProduct(item)}
									>
										<div className='flex items-center gap-x-5 gap-y-2 flex-wrap text-start w-[60%] justify-between text-foreground text-sm'>
											<span>{item?.sku || ""}</span>
											<span>Qty: {item?.qty || 0}</span>
										</div>

										<Button
											variant='ghostSecondary'
											className={`${
												selectedIndex === index
													? "opacity-100 visible delay-200"
													: "opacity-0 invisible"
											} transition-all duration-300 text-xs font-normal h-6 w-[50px] px-0 py-0 group-hover:opacity-100 group-hover:visible
														`}
										>
											Enter
										</Button>
									</div>
								);
							})
						) : (
							<div className='flex items-center justify-center h-[60px] border-b border-border'>
								<span className='text-center whitespace-nowrap text-nowrap text-sm leading-[21px] font-normal text-foreground'>
									{debounceSearch.length > 0
										? "Oops! We couldn't find any matches."
										: "No Product Found"}
								</span>
							</div>
						)}
					</div>
				</div>

				<div className='flex-1 overflow-y-auto '>
					<SimpleTable head={SHOPIFY_PRODUCT_DATA_CUSTOM}>
						{product && product?.length > 0 ? (
							product?.map((item, index) => (
								<TableRow
									key={index}
									className='cursor-pointer hover:bg-gray-100 '
								>
									<TableCell className='font-medium text-sm text-semi-black pl-5 whitespace-normal text-wrap'>
										<div className='flex flex-row items-center gap-2'>
											<div className='bg-secondary-grey min-w-10 size-10 rounded border border-borderColor flex items-center justify-center'>
												{item?.image ? (
													<img
														src={item?.image as string}
														alt={item?.name}
														width={40}
														height={40}
														className='object-cover size-full rounded'
													/>
												) : (
													<PhotoIcon width={20} height={20} />
												)}
											</div>
											<span className='wrap-break-word'>
												{item?.name || item?.sku}
											</span>
										</div>
									</TableCell>

									<TableCell className='font-medium'>
										{item?.sku || "N/A"}
									</TableCell>

									<TableCell>
										<Input
											placeholder='e.g 10'
											name='price'
											type='number'
											min={0}
											value={item.price || ""}
											onChange={(e) =>
												handleProductChange(index, e.target.value, "price")
											}
											className='h-[30px] border border-borderColor rounded-[3px] placeholder:text-grey text-sm font-normal px-2 py-[5px]'
										/>
									</TableCell>
									<TableCell>
										<Input
											placeholder='Qty'
											name='qty'
											type='number'
											min={0}
											value={item.qty || ""}
											onChange={(e) => {
												const qty = Number(e.target.value) || 0;

												if (item.actualQty && qty > item.actualQty) {
													toast.error(
														`${item.sku} has only ${item.actualQty} units available.`,
													);
												} else
													handleProductChange(index, e.target.value, "qty");
											}}
											className='h-[30px] border border-borderColor rounded-[3px] placeholder:text-grey text-sm font-normal px-2 py-[5px]'
										/>
									</TableCell>

									<TableCell className='h-[60px] pr-5'>
										<TableIcon
											src={Trash}
											alt='Trash'
											tooltipId='delete-tooltip'
											data-tooltip-content='Delete'
											className='bg-light-red'
											onClick={() => handleDeleteProduct(index)}
										/>
									</TableCell>
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={SHOPIFY_PRODUCT_DATA_CUSTOM.length}
									className='text-center font-medium'
								>
									No Products Selected Yet
								</TableCell>
							</TableRow>
						)}
					</SimpleTable>

					<div className='flex items-center justify-between px-5  py-3 h-[50px]'>
						<span className='text-semi-black text-sm'>
							Total: Rs. {totalAmount}
						</span>

						<Button
							variant='primary'
							className='w-fit sm:min-w-32 h-9  font-medium text-sm  py-3 px-5'
							onClick={() => {
								if (product.length === 0)
									toast.error("No custom product added.");
								else {
									setProduct([]);
									setSearch("");
									setIsFocused(false);
									handleSumbit(product);
								}

								handleCancel?.();
							}}
						>
							Submit
						</Button>
					</div>
				</div>

				<CloseIcon
					className='absolute top-2.5 right-3 cursor-pointer'
					onClick={handleCancel}
				/>
			</DialogContent>
		</Dialog>
	);
};

export default AddCustomProductModal;
