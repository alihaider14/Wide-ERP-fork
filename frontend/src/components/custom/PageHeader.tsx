import { Chevron } from "@/assets/svg";

type TProps = {
	heading?: string;
	backButtonText?: string;
	isbackIcon?: boolean;
	onClickBack?: () => void;
	subHeading?: string;
	onClickSubHeading?: () => void;
};

const PageHeader = ({
	heading,
	backButtonText,
	isbackIcon = true,
	onClickBack,
	onClickSubHeading,
	subHeading,
}: TProps) => {
	return (
		<div className='w-full flex flex-row justify-between items-center pb-5 flex-wrap'>
			<div className='flex items-center gap-[30px]'>
				<span className='text-2xl font-medium leading-[36px] text-semi-black'>
					{heading}
				</span>
				{subHeading && (
					<span
						className='text-sm font-normal text-primary underline cursor-pointer'
						onClick={onClickSubHeading}
					>
						{subHeading}
					</span>
				)}
			</div>

			{backButtonText && (
				<div
					className='flex items-center gap-3.5 hover:bg-accent hover:text-accent-foreground cursor-pointer h-9 px-2 py-1 sm:px-4 sm:py-2 rounded-sm'
					onClick={onClickBack}
				>
					{isbackIcon && (
						<img src={Chevron} alt='arrow-left' width={24} height={24} />
					)}
					<span className='text-grey font-medium text-sm leading-[21px] text-nowrap'>
						{backButtonText}
					</span>
				</div>
			)}
		</div>
	);
};

export default PageHeader;
