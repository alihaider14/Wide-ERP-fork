import { COLOR } from "@/constant/Colors";
import { TEmployeeSummaryCardProps } from "@/types/Employee";
import StatusCell from "./StatusCell";

const EmployeeSummaryCard = ({
	employeeName,
	statusLabel,
	designationLabel,
	phoneLabel,
	baseSalaryLabel,
	experienceLabel,
	attendanceLabel,
}: TEmployeeSummaryCardProps) => {
	return (
		<div className='w-full min-h-[192px] rounded-[5px] border border-border bg-white p-5 md:p-10'>
			<div className='flex flex-col gap-5 md:gap-6'>
				<div className='flex flex-col gap-4 lg:h-[30px] lg:w-full lg:max-w-[1218px] lg:flex-row lg:items-center lg:justify-between'>
					<div className='flex flex-wrap items-center gap-3 lg:h-[30px] lg:gap-5'>
						<h2 className='text-[28px] font-semibold leading-none text-semi-black'>
							{employeeName}
						</h2>
						{statusLabel ? (
							<StatusCell status={statusLabel} className='w-[100px]' />
						) : (
							<span className='text-sm text-grey'>-</span>
						)}
					</div>

					<div className='flex items-center gap-2 lg:h-[21px] lg:shrink-0 lg:whitespace-nowrap'>
						<span className='font-poppins text-[14px] font-normal leading-[100%] tracking-[0]'>
							Designation:
						</span>
						<span
							className='font-poppins text-[14px] font-medium leading-[100%] tracking-[0]'
							style={{ color: COLOR.semiBlack }}
						>
							{designationLabel}
						</span>
					</div>
				</div>

				<div className='flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-semi-black'>
					<div className='flex h-[21px] w-[160px] items-center gap-2'>
						<span className='font-poppins text-[14px] font-normal leading-[100%] tracking-[0]'>
							Phone:
						</span>
						<span
							className='font-poppins text-[14px] font-medium leading-[100%] tracking-[0]'
							style={{ color: COLOR.semiBlack }}
						>
							{phoneLabel}
						</span>
					</div>
					<div className='flex h-[21px] items-center gap-2 md:w-[164px]'>
						<span className='font-poppins text-[14px] font-normal leading-[100%] tracking-[0]'>
							Base Salary:
						</span>
						<span
							className='font-poppins text-[14px] font-medium leading-[100%] tracking-[0]'
							style={{ color: COLOR.semiBlack }}
						>
							{baseSalaryLabel}
						</span>
					</div>
					<div className='flex items-start gap-2 md:w-[350px]'>
						<span className='font-poppins text-[14px] font-normal leading-[100%] tracking-[0] shrink-0'>
							Experience:
						</span>
						<span
							className='font-poppins text-[14px] font-medium leading-[100%] tracking-[0]'
							style={{ color: COLOR.semiBlack }}
						>
							{experienceLabel}
						</span>
					</div>
				</div>

				<div className='flex h-[21px] items-center gap-2'>
					<span
						className='font-poppins text-[14px] font-normal leading-[100%] tracking-[0]'
						style={{ color: COLOR.semiBlack }}
					>
						Attendance This Month:
					</span>
					<span
						className='font-poppins text-[14px] font-medium leading-[100%] tracking-[0]'
						style={{ color: COLOR.semiBlack }}
					>
						{attendanceLabel}
					</span>
				</div>
			</div>
		</div>
	);
};

export default EmployeeSummaryCard;
