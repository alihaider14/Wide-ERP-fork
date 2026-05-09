import { Edit, Trash } from "@/assets/svg";
import {
	AccessPopup,
	CustomLoader,
	CustomTable,
	Layout,
	Prompt,
	TableIcon,
	TableRowLoader,
} from "@/components";
import { TableCell, TableRow } from "@/components/ui/table";
import { USER_HEAD_DATA } from "@/constant/tableData";
import useUsers from "@/hooks/useUsers";
import { COLOR } from "@/constant/Colors";
import { ChevronDownIcon } from "lucide-react";
import { formatDateToLocaleString } from "@/helper/time-formator";
import { TUser } from "@/types/User";
import useAccessStore from "@/hooks/useAccessStore";
import { ACCESS } from "@/constant/Checkbox";

const Users = () => {
	const hasAccess = useAccessStore((state) => state.hasAccess);
	const {
		isPaginationData,
		isCustomerLoader,
		isTableLoader,
		data,
		pageNo,
		pageSize,
		accessPopUp,
		prompt,
		navigate,
		handleNextPage,
		handlePrevPage,
		handleLastPage,
		handleChangePageSize,
		handleFirstPage,
		handleSumbitPrompt,
		setAccessPopUp,
		handleCancelPrompt,
		handleOpenPrompt,
	} = useUsers();

	return (
		<Layout headerTitle='Users' buttonLabel='User'>
			<CustomLoader isLoading={isCustomerLoader} />
			<Prompt
				open={prompt?.open || false}
				title={`Remove ${prompt?.data?.full_name}`}
				description={`Please confirm if you'd like to remove ${prompt?.data?.full_name}.`}
				handleSumbit={handleSumbitPrompt}
				handleCancel={handleCancelPrompt}
				cancelButtonText='No, cancel'
				sumbitButtonText='Yes, remove'
				sumbitButtonVariant='destructive'
			/>

			<AccessPopup
				data={accessPopUp?.data}
				open={accessPopUp?.open}
				handleCancel={() =>
					setAccessPopUp({
						...accessPopUp,
						open: false,
					})
				}
			/>

			<CustomTable
				buttonLabel='+ Add User'
				head={USER_HEAD_DATA}
				onClickButton={() => navigate("/add-user")}
				disabledBtn={!hasAccess(ACCESS.create_user)}
				remaining={
					isPaginationData
						? `${data?.from} - ${data?.to} of ${data?.total_rows}`
						: "0 - 0 of 0"
				}
				handleChangePageSize={handleChangePageSize}
				handleFirstPage={handleFirstPage}
				handleLastPage={handleLastPage}
				handleNextPage={handleNextPage}
				handlePrevPage={handlePrevPage}
				pageSize={pageSize}
				disabledPagination={{
					next: !isPaginationData || data?.total_pages === pageNo,
					prev: !isPaginationData || pageNo === 1,
					first: !isPaginationData || pageNo === 1,
					last: !isPaginationData || data?.total_pages === pageNo,
				}}
				searchPlaceholder='Search'
			>
				{isTableLoader ? (
					<TableRowLoader rowsNum={10} cellsNum={USER_HEAD_DATA.length} />
				) : data && data?.users?.length > 0 ? (
					data?.users?.map((user: TUser, index: number) => {
						return (
							<TableRow
								key={index}
								className='group'
								style={{ height: "50px" }}
							>
								<TableCell className='pl-5 md:pl-10 '>{index + 1}</TableCell>
								<TableCell className='font-medium'>
									{user?.full_name || "N/A"}
								</TableCell>
								<TableCell>{user?.email || "N/A"}</TableCell>
								<TableCell>{user?.phone || 0}</TableCell>
								<TableCell>
									<div
										className='flex items-center gap-[10px] cursor-pointer'
										onClick={() => {
											setAccessPopUp({
												open: true,
												data: user,
											});
										}}
									>
										{user?.designation || 0}

										<ChevronDownIcon
											color={COLOR?.semiBlack}
											className='size-[14px] group-hover:visible group-hover:opacity-100 invisible transition-all duration-300 opacity-0 '
										/>
									</div>
								</TableCell>
								<TableCell>
									{formatDateToLocaleString(
										user?.updatedAt ? new Date(user.updatedAt) : undefined,
										"MMM D, YYYY",
									) || "N/A"}
								</TableCell>

								<TableCell className='pr-5 md:pr-10'>
									<div className='flex items-center justify-center gap-3'>
										<TableIcon
											src={Edit}
											alt='edit'
											tooltipId='edit-tooltip'
											data-tooltip-content='Edit'
											className='bg-grey-100'
											onClick={() => navigate(`/update-user/${user?._id}`)}
											disabledBtn={!hasAccess(ACCESS.update_user)}
										/>

										<TableIcon
											src={Trash}
											alt='Trash'
											tooltipId='delete-tooltip'
											data-tooltip-content='Delete'
											className='bg-light-red'
											onClick={() => handleOpenPrompt(user)}
											disabledBtn={!hasAccess(ACCESS.delete_user)}
										/>
									</div>
								</TableCell>
							</TableRow>
						);
					})
				) : (
					<TableRow>
						<TableCell colSpan={USER_HEAD_DATA.length} className='text-center'>
							No Users Found
						</TableCell>
					</TableRow>
				)}
			</CustomTable>
		</Layout>
	);
};

export default Users;
