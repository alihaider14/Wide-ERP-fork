import {
	CustomLoader,
	CustomTable,
	Layout,
	Prompt,
	TableIcon,
	TableRowLoader,
} from "@/components";
import { TableCell, TableRow } from "@/components/ui/table";
import { COURIER_HEAD_DATA } from "@/constant/tableData";
import useCouriers from "@/hooks/useCouriers";
import useAccessStore from "@/hooks/useAccessStore";
import { ACCESS } from "@/constant/Checkbox";
import { Edit, Trash } from "@/assets/svg";
import { TCourier } from "@/types/Courier";
import { formatDateToLocaleString } from "@/helper/time-formator";
import StatusCell from "@/components/custom/StatusCell";

const Couriers = () => {
	const hasAccess = useAccessStore((state) => state.hasAccess);
	const {
		isCustomerLoader,
		isTableLoader,
		couriersData,
		pageSize,
		navigate,
		handleNextPage,
		handlePrevPage,
		handleLastPage,
		handleChangePageSize,
		handleFirstPage,
		search,
		setSearch,
		prompt,
		setPrompt,
		handleSumbitPrompt,
		handleCancelPrompt,
	} = useCouriers();

	return (
		<Layout headerTitle='Couriers' buttonLabel='Couriers'>
			<CustomLoader isLoading={isCustomerLoader} />
			<Prompt
				open={prompt.open}
				title={`Remove ${prompt.data?.name || ""}`}
				description={`Please confirm if you'd like to remove ${
					prompt.data?.name || ""
				}.`}
				handleSumbit={handleSumbitPrompt}
				handleCancel={handleCancelPrompt}
				cancelButtonText='No, cancel'
				sumbitButtonText='Yes, remove'
				sumbitButtonVariant='destructive'
			/>
			<CustomTable
				searchValue={search}
				searchPlaceholder='Search'
				onChangeSearch={(e) => setSearch(e.target.value)}
				buttonLabel='+ Add Courier'
				head={COURIER_HEAD_DATA}
				onClickButton={() => navigate("/add-courier")}
				disabledBtn={!hasAccess(ACCESS.create_courier)}
				remaining={
					couriersData?.length > 0
						? `${1} - ${couriersData?.length} of ${couriersData?.length}`
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
			>
				{isTableLoader ? (
					<TableRowLoader rowsNum={10} cellsNum={COURIER_HEAD_DATA.length} />
				) : couriersData?.length > 0 ? (
					couriersData.map(
						(
							courier: TCourier & { _id?: string; updated_at?: string },
							index: number,
						) => (
							<TableRow
								key={courier._id || index}
								className='group'
								style={{ height: "50px" }}
							>
								<TableCell className='font-medium ps-7'>
									{courier?.name || "N/A"}
								</TableCell>
								<TableCell>{courier?.shop || "N/A"}</TableCell>
								<TableCell>
									<StatusCell status={courier?.status || "N/A"} />
								</TableCell>
								<TableCell>
									{formatDateToLocaleString(
										courier?.updated_at
											? new Date(courier.updated_at)
											: undefined,
										"MMM D, YYYY",
									)}
								</TableCell>
								<TableCell className='pr-5 md:pr-10'>
									<div className='flex items-center justify-center gap-3'>
										<TableIcon
											src={Edit}
											alt='edit'
											tooltipId='edit-tooltip'
											data-tooltip-content='Edit'
											className='bg-grey-100'
											disabledBtn={!hasAccess(ACCESS.update_courier)}
											onClick={() => navigate(`/update-courier/${courier._id}`)}
										/>
										<TableIcon
											src={Trash}
											alt='Trash'
											tooltipId='delete-tooltip'
											data-tooltip-content='Delete'
											className='bg-light-red'
											disabledBtn={!hasAccess(ACCESS.delete_courier)}
											onClick={() =>
												setPrompt({
													open: true,
													data: { ...courier, _id: courier._id || "" },
												})
											}
										/>
									</div>
								</TableCell>
							</TableRow>
						),
					)
				) : (
					<TableRow>
						<TableCell
							colSpan={COURIER_HEAD_DATA.length}
							className='text-center'
						>
							No Couriers Found
						</TableCell>
					</TableRow>
				)}
			</CustomTable>
		</Layout>
	);
};

export default Couriers;
