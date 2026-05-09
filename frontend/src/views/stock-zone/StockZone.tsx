import {
	CustomLoader,
	CustomTable,
	Layout,
	Prompt,
	TableIcon,
	TableRowLoader,
} from "@/components";
import { TableCell, TableRow } from "@/components/ui/table";
import { STOCK_ZONE_HEAD_DATA } from "@/constant/tableData";
import useStockZone from "@/hooks/useStockZone";
import useAccessStore from "@/hooks/useAccessStore";
import { ACCESS } from "@/constant/Checkbox";
import { Edit, Trash } from "@/assets/svg";
import { format } from "date-fns";
import { TStockZone } from "@/types/StockZone";

const StockZone = () => {
	const hasAccess = useAccessStore((state) => state.hasAccess);
	const {
		isCustomerLoader,
		isTableLoader,
		stockZoneData,
		pageSize,
		prompt,
		navigate,
		handleNextPage,
		handlePrevPage,
		handleLastPage,
		handleChangePageSize,
		handleFirstPage,
		handleSumbitPrompt,
		handleCancelPrompt,
		handleOpenPrompt,
		search,
		setSearch,
	} = useStockZone();

	return (
		<Layout headerTitle='Stock Zone' buttonLabel='Stock Zone'>
			<CustomLoader isLoading={isCustomerLoader} />
			<Prompt
				open={prompt?.open || false}
				title={`Remove ${prompt?.data?.name}`}
				description={`Please confirm if you'd like to remove ${prompt?.data?.name}.`}
				handleSumbit={handleSumbitPrompt}
				handleCancel={handleCancelPrompt}
				cancelButtonText='No, cancel'
				sumbitButtonText='Yes, remove'
				sumbitButtonVariant='destructive'
			/>

			<CustomTable
				searchValue={search}
				onChangeSearch={(e) => setSearch(e.target.value)}
				buttonLabel='+ Add Stock Zone'
				head={STOCK_ZONE_HEAD_DATA}
				onClickButton={() => navigate("/add-stock-zone")}
				disabledBtn={!hasAccess(ACCESS.add_stock_zone)}
				remaining={
					stockZoneData?.length > 0
						? `${1} - ${stockZoneData?.length} of ${stockZoneData?.length}`
						: "0 - 0 of 0"
				}
				handleChangePageSize={handleChangePageSize}
				handleFirstPage={handleFirstPage}
				handleLastPage={handleLastPage}
				handleNextPage={handleNextPage}
				handlePrevPage={handlePrevPage}
				pageSize={pageSize}
				disabledPagination={{
					next: true,
					prev: true,
					first: true,
					last: true,
				}}
				searchPlaceholder='Search'
			>
				{isTableLoader ? (
					<TableRowLoader rowsNum={10} cellsNum={STOCK_ZONE_HEAD_DATA.length} />
				) : stockZoneData?.length > 0 ? (
					stockZoneData.map((zone: TStockZone, index: number) => {
						return (
							<TableRow
								key={index}
								className='group'
								style={{ height: "50px" }}
							>
								<TableCell className='font-medium ps-7'>
									{zone?.name || "N/A"}
								</TableCell>
								<TableCell>{zone?.products || 0}</TableCell>
								<TableCell>{zone?.stock || "N/A"}</TableCell>
								<TableCell>
									{zone?.updatedAt
										? format(new Date(zone.updatedAt), "MMM d, yyyy")
										: "N/A"}
								</TableCell>
								<TableCell className='pr-5 md:pr-10'>
									<div className='flex items-center justify-center gap-3'>
										<TableIcon
											src={Edit}
											alt='edit'
											tooltipId='edit-tooltip'
											data-tooltip-content='Edit'
											className='bg-grey-100'
											disabledBtn={!hasAccess(ACCESS.update_stock_zone)}
											onClick={() => navigate(`/update-stock-zone/${zone._id}`)}
										/>

										<TableIcon
											src={Trash}
											alt='Trash'
											tooltipId='delete-tooltip'
											data-tooltip-content='Delete'
											className='bg-light-red'
											disabledBtn={!hasAccess(ACCESS.delete_stock_zone)}
											onClick={() => handleOpenPrompt(zone)}
										/>
									</div>
								</TableCell>
							</TableRow>
						);
					})
				) : (
					<TableRow>
						<TableCell
							colSpan={STOCK_ZONE_HEAD_DATA.length}
							className='text-center'
						>
							No Stock Zones Found
						</TableCell>
					</TableRow>
				)}
			</CustomTable>
		</Layout>
	);
};

export default StockZone;
