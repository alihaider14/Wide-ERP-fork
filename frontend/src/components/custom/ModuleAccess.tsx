import { DoubleCheck } from "@/assets/svg";

type TProps = {
	title: string;
	access: string[];
};

const ModuleAccess = ({ access, title }: TProps) => {
	return (
		<div className='flex flex-col gap-5 '>
			<span className='font-semibold text-sm text-foreground'>{title}</span>

			<div className='flex flex-col gap-[30px]'>
				{access?.length > 0 ? (
					access.map((item, index) => {
						return (
							<div className='flex items-center gap-3' key={index}>
								<img
									src={DoubleCheck}
									alt='DoubleCheck'
									width={20}
									height={20}
								/>

								<span className='font-normal text-sm text-foreground'>
									{item}
								</span>
							</div>
						);
					})
				) : (
					<span className='font-normal text-sm text-foreground'>No Access</span>
				)}
			</div>
		</div>
	);
};

export default ModuleAccess;
