import SearchInput from "./SearchInput";
import { Button } from "../ui/button";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationPrevious,
	PaginationNext,
	PaginationFirst,
	PaginationLast,
	SelectRowsPerPage
} from "../ui/pagination";
import { COLOR } from "@/constant/Colors";
import SimpleTable from "./SimpleTable";
import { TProductFilter } from "@/types/Products";
import { Plus, Refresh, Upload } from "@/assets/svg";
import type { THead } from "./SimpleTable";

type TProps = {
	searchValue?: string;
	onChangeSearch?: (e: React.ChangeEvent<HTMLInputElement>) => void;
	head: THead[];
	children: React.ReactNode;
	onClickImportProduct?: () => void;
	handleChangePageSize: (pageSize: number) => void;
	pageSize?: number;
	remaining?: string;
	handleFirstPage?: () => void;
	handlePrevPage?: () => void;
	handleNextPage?: () => void;
	handleLastPage?: () => void;
	onClickAddProduct?: () => void;
	onClickImportProductQuantites?: () => void;
	onClickSyncShopify?:() => void;
	disabledPagination: {
		first: boolean;
		prev: boolean;
		next: boolean;
		last: boolean;
	};
	disabledBtns: {
		addProduct: boolean;
		importProduct: boolean;
		importProductQuantities: boolean;
		syncShopify: boolean;
	};
	kpisData: {
		products_count: string;
		items: string;
		sold_out: string;
		low_stock_items: string;
	};
	handleReset?: () => void;
	handleFilters: (item: TProductFilter) => void;
	sortBy?: string;
	sortOrder?: "asc" | "desc";
	onSort?: (key: string) => void;
};

const ProductTable = ({
	onChangeSearch,
	searchValue,
	head,
	children,
	onClickImportProduct,
	remaining,
	handleChangePageSize,
	pageSize = 10,
	handleFirstPage,
	handlePrevPage,
	handleNextPage,
	handleLastPage,
	onClickAddProduct,
	disabledPagination,
	onClickImportProductQuantites,
	onClickSyncShopify,
	disabledBtns,
	kpisData: { products_count, items, sold_out, low_stock_items: lowStockItems },
	handleReset,
	handleFilters,
	sortBy,
	sortOrder,
	onSort
}: TProps) => {
	return (
		<div className="w-full bg-white border-x border-t border-border rounded-[5px] overflow-hidden">
			<div className="p-5 md:px-10 pt-10 pb-8 flex flex-col xl:flex-row justify-between items-center gap-7 ">
				<SearchInput
					value={searchValue}
					onChange={onChangeSearch}
					className="w-full xl:max-w-[500px]"
					placeholder="Search product"
					onNextPage={!disabledPagination?.next ? handleNextPage : undefined}
					onPrevPage={!disabledPagination?.prev ? handlePrevPage : undefined}
				/>

				<div className="flex flex-col xl:flex-row items-center gap-5 w-full justify-end ">
					<Button
						onClick={onClickAddProduct}
						disabled={disabledBtns?.addProduct}
						className="min-w-[123px] w-full xl:w-auto  "
					>
						<img
							alt="Plus"
							src={Plus}
							width={20}
							height={20}
						/>
						Product
					</Button>

					<Button
						onClick={onClickImportProduct}
						disabled={disabledBtns?.importProduct}
						className="min-w-[131px] w-full xl:w-auto "
					>
						<img
							alt="Upload"
							src={Upload}
							width={20}
							height={20}
						/>
						Products
					</Button>
					<Button
						onClick={onClickSyncShopify}
						disabled={disabledBtns?.syncShopify}
						className="min-w-32.75 w-full xl:w-auto "
					>
						<img
							alt="Sync Shopify"
							src={Refresh}
							width={20}
							height={20}
						/>
						Sync Shopify
					</Button>
					<Button
						onClick={onClickImportProductQuantites}
						disabled={disabledBtns?.importProductQuantities}
						className="min-w-[141px] w-full xl:w-auto"
					>
						<img
							alt="Upload"
							src={Upload}
							width={20}
							height={20}
						/>
						Quantities
					</Button>
				</div>
			</div>

			<div className="flex justify-between items-center w-full min-h-[60px] p-5 md:px-10  flex-wrap  border-t border-secondary-grey gap-2">
				<div className="flex items-center gap-5 flex-wrap">
					<span className="font-normal text-foreground text-sm tracking-[0.02em]">
						Products:{" "}
						<span className="font-semibold">{products_count || 0}</span>
					</span>
					<span className="font-normal text-foreground text-sm tracking-[0.02em]">
						Items:
						<span className="font-semibold"> {items || 0}</span>
					</span>
					<span
						className="font-normal text-foreground text-sm tracking-[0.02em] hover:underline cursor-pointer underline-offset-2"
						onClick={() => handleFilters("low_stock")}
					>
						Low Stock Items:
						<span className="font-semibold"> {lowStockItems || 0}</span>
					</span>
					<span
						className="font-normal text-foreground text-sm tracking-[0.02em] hover:underline cursor-pointer underline-offset-2"
						onClick={() => handleFilters("sold_out")}
					>
						Sold Out:
						<span className="font-semibold"> {sold_out || 0}</span>
					</span>
					<span
						className="font-medium text-secondary-foreground hover:text-foreground text-sm tracking-[0.02em] cursor-pointer"
						onClick={handleReset}
					>
						Reset
					</span>
				</div>

				<div className="flex items-center lg:gap-[50px] gap-2 flex-wrap">
					<SelectRowsPerPage
						options={[10, 20, 50]}
						setPageSize={handleChangePageSize}
						pageSize={pageSize}
					/>

					<span className="text-sm text-foreground tracking-[0.02em] whitespace-nowrap shrink-0">
						{remaining}
					</span>

					<Pagination>
						<PaginationContent>
							<PaginationItem>
								<PaginationFirst
									onClick={handleFirstPage}
									color={
										disabledPagination?.first
											? COLOR?.offWhite
											: COLOR?.lightBlack
									}
									className={`${
										disabledPagination?.first &&
										"cursor-default hover:bg-transparent"
									}`}
								/>
							</PaginationItem>
							<PaginationItem>
								<PaginationPrevious
									onClick={handlePrevPage}
									color={
										disabledPagination?.prev
											? COLOR?.offWhite
											: COLOR?.lightBlack
									}
									className={`${
										disabledPagination?.prev &&
										"cursor-default hover:bg-transparent"
									}`}
								/>
							</PaginationItem>
							<PaginationItem>
								<PaginationNext
									onClick={handleNextPage}
									color={
										disabledPagination?.next
											? COLOR?.offWhite
											: COLOR?.lightBlack
									}
									className={`${
										disabledPagination?.next &&
										"cursor-default hover:bg-transparent"
									}`}
								/>
							</PaginationItem>
							<PaginationItem>
								<PaginationLast
									onClick={handleLastPage}
									color={
										disabledPagination?.last
											? COLOR?.offWhite
											: COLOR?.lightBlack
									}
									className={`${
										disabledPagination?.last &&
										"cursor-default hover:bg-transparent"
									}`}
								/>
							</PaginationItem>
						</PaginationContent>
					</Pagination>
				</div>
			</div>
			<SimpleTable
				head={head}
				sortBy={sortBy}
				sortOrder={sortOrder}
				onSort={onSort}
			>
				{children}
			</SimpleTable>
		</div>
	);
};

export default ProductTable;
