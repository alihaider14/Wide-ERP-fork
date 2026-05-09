import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { handleApiError } from "@/helper/error-function";
import { TError } from "@/types/TError";
import { useDebounce } from "@/hooks/useDebounce";
import { ScaleLoader } from "react-spinners";
import { COLOR } from "@/constant/Colors";
import SearchInput from "./SearchInput";
import { useQuery } from "@tanstack/react-query";
import { TShopifyProduct } from "@/types/shopify";
import { getShopifyProductByShopId } from "@/services/shopifyorders";
import { PhotoIcon } from "@/assets/svg";

type TProps = {
	shopId: string;
	handleAddProduct: (newProducts: TShopifyProduct) => void;
};

const SearchShopifyProduct = ({ shopId, handleAddProduct }: TProps) => {
	const [isFocused, setIsFocused] = useState(false);
	const [selectedIndex, setSelectedIndex] = useState(0);
	const [search, setSearch] = useState("");

	const debounceSearch = useDebounce(search);

	const {
		data: availableProducts,
		error,
		isLoading,
		isError,
	} = useQuery({
		queryKey: ["getShopifyProductByShopId", debounceSearch, shopId],
		queryFn: ({ signal }) =>
			getShopifyProductByShopId({
				shopId,
				size: 10,
				q: debounceSearch,
				signal,
			}),
		enabled: !!isFocused && Boolean(debounceSearch.length > 2) && !!shopId,
	});

	if (isError)
		handleApiError(error as unknown as TError, "Oops! something went wrong");

	const addProduct = (product: TShopifyProduct) => {
		handleAddProduct({
			...product,
			actualQty: product.qty || 0,
			actualPrice: Number(product.price || 0),
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

	return (
		<div className='h-[60px] py-3 px-5  flex items-center justify-center bg-secondary-grey relative border-b  border-border rounded-t-[5px]'>
			<SearchInput
				value={search || ""}
				onChange={(e) => setSearch(e.target.value)}
				placeholder='Search to add more products'
				className='w-full'
				isFocusButtons
				onFocus={() => setIsFocused(true)}
				onBlur={() => setTimeout(() => setIsFocused(false), 200)}
			/>

			<div
				className={`absolute flex flex-col left-5  top-14 lg:min-h-[600px] w-[80%] lg:max-w-[650px] border-border border shadow-[0_4px_8px_3px] shadow-shadow rounded-[5px] bg-white z-50  overflow-auto
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
											{item?.sku || item?.name}
										</span>
									</div>
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
	);
};

export default SearchShopifyProduct;
