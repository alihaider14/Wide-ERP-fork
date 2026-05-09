interface TDashboardCardProps {
	label: string;
	value: string;
}

const DashboardCard: React.FC<TDashboardCardProps> = ({ label, value }) => {
	return (
		<div className="flex flex-col gap-3 items-center rounded-sm bg-white py-5 justify-center border border-borderColor relative">
			<div className="absolute top-0 left-0 w-full h-1 rounded-t-sm bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
			<span className="text-lg xl:text-xl font-medium text-semi-black font-poppins mt-2">
				{label}
			</span>
			<span className="text-3xl xl:text-4xl font-semibold text-semi-black font-poppins">
				{value}
			</span>
		</div>
	);
};

export default DashboardCard;
