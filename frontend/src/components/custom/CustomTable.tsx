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
	SelectRowsPerPage,
} from "../ui/pagination";
import { COLOR } from "@/constant/Colors";
import SimpleTable from "./SimpleTable";

export type THead = {
	title: React.ReactNode;
	className?: string;
};

type TProps = {
	searchValue?: string;
	onChangeSearch?: (e: React.ChangeEvent<HTMLInputElement>) => void;
	buttonLabel?: string;
	head: THead[];
	children: React.ReactNode;
	onClickButton?: () => void;
	searchClassName?: string;
	searchRightComponent?: React.ReactNode;
	handleChangePageSize: (pageSize: number) => void;
	pageSize?: number;
	remaining?: string;
	searchPlaceholder?: string;
	handleFirstPage?: () => void;
	handlePrevPage?: () => void;
	handleNextPage?: () => void;
	handleLastPage?: () => void;
	isPaginationText?: React.ReactNode;
	disabledBtn?: boolean;
	secondBtnLabel?: string;
	secondBtnClick?: () => void;
	secondBtnDisabled?: boolean;
	rightComponent?: React.ReactNode;
	hidePagination?: boolean;
	disabledPagination: {
		first: boolean;
		prev: boolean;
		next: boolean;
		last: boolean;
	};
	hideFirstLastPagination?: boolean;
	onlyFirstLastPagination?: boolean;
	selectPerRowsOptions?: number[];
	headerRowHeight?: string;
	bodyRowHeight?: string;
	bodyCellPaddingY?: string;
	remainingWidth?: string;
	paginationWidth?: string;
	searchAdjacentComponent?: React.ReactNode;
};

const CustomTable = ({
	onChangeSearch,
	buttonLabel,
	searchValue,
	head,
	children,
	onClickButton,
	remaining,
	searchClassName,
	searchRightComponent,
	handleChangePageSize,
	pageSize = 10,
	handleFirstPage,
	handlePrevPage,
	handleNextPage,
	handleLastPage,
	isPaginationText,
	disabledBtn,
	secondBtnLabel,
	secondBtnClick,
	secondBtnDisabled,
	rightComponent,
	hidePagination = false,
	disabledPagination,
	hideFirstLastPagination,
	onlyFirstLastPagination,
	selectPerRowsOptions = [10, 20],
	headerRowHeight,
	bodyRowHeight,
	bodyCellPaddingY,
	searchPlaceholder,
	remainingWidth,
	paginationWidth,
	searchAdjacentComponent
}: TProps) => {
	return (
		<div className='w-full mt-[20px] bg-white border-x border-t border-border rounded-[5px] overflow-x-auto'>
			<div className='py-[20px] px-[20px] flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4'>
				<SearchInput
					placeholder={searchPlaceholder}
					value={searchValue}
					onChange={onChangeSearch}
					className={`w-full md:max-w-[500px] ${searchClassName || ""}`}
					id='shopSearch'
					name='shopSearch'
					onNextPage={!disabledPagination?.next ? handleNextPage : undefined}
					onPrevPage={!disabledPagination?.prev ? handlePrevPage : undefined}
				/>
				{searchAdjacentComponent}

				<div className='flex flex-col lg:flex-row justify-end gap-4 w-full'>
					{searchRightComponent && (
						<div className='flex items-start md:items-center'>
							{searchRightComponent}
						</div>
					)}
					{rightComponent && rightComponent}

					{(secondBtnLabel || buttonLabel) && (
						<div className='flex flex-col lg:flex-row items-center justify-end gap-5 w-full'>
							{secondBtnLabel && (
								<Button
									onClick={secondBtnClick}
									disabled={secondBtnDisabled}
									className='lg:min-w-48 w-full lg:w-auto'
								>
									{secondBtnLabel}
								</Button>
							)}

							{buttonLabel && (
								<Button
									onClick={onClickButton}
									disabled={disabledBtn}
									className='lg:min-w-48 w-full lg:w-auto'
								>
									{buttonLabel}
								</Button>
							)}
						</div>
					)}
				</div>
			</div>

			{!hidePagination && (
				<div
					className={`${
						isPaginationText ? "justify-between" : "justify-end"
					} flex items-center w-full min-h-[50px] p-20px md:px-[20px] flex-wrap border-t-[0.5px] border-borderColor gap-2`}
				>
					{isPaginationText && (
						<div className='flex items-center gap-5 flex-wrap'>
							{isPaginationText}
						</div>
					)}

					<div className='flex items-center lg:gap-[50px] gap-2 flex-wrap'>
						<SelectRowsPerPage
							options={selectPerRowsOptions || [10, 20]}
							setPageSize={handleChangePageSize}
							pageSize={pageSize}
						/>

						{remaining && (
							<span
								className='text-sm tracking-[0.02em] whitespace-nowrap shrink-0'
								style={{
									color: COLOR.semiBlack,
									...(remainingWidth && {
										minWidth: remainingWidth,
										textAlign: "center",
									}),
								}}
							>
								{remaining}
							</span>
						)}

						<Pagination style={paginationWidth ? { width: paginationWidth } : undefined}>
							<PaginationContent>
								{onlyFirstLastPagination ? (
									<>
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
									</>
								) : (
									<>
										{!hideFirstLastPagination && (
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
										)}
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
										{!hideFirstLastPagination && (
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
										)}
									</>
								)}
							</PaginationContent>
						</Pagination>
					</div>
				</div>
			)}

			<SimpleTable
				head={head}
				headerRowHeight={headerRowHeight}
				bodyRowHeight={bodyRowHeight}
				bodyCellPaddingY={bodyCellPaddingY}
			>
				{children}
			</SimpleTable>
		</div>
	);
};

export default CustomTable;