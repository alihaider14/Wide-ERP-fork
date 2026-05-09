import React from "react";

interface TopSellingProductsCardProps {
	topProducts: { sku: string; totalSold: number }[];
	isLoading: boolean;
}

const TopSellingProductsCard: React.FC<TopSellingProductsCardProps> = ({
	topProducts,
	isLoading
}) => (
	<div className="w-full max-w-xl mx-auto flex flex-col gap-4 items-center bg-white py-7 px-6 rounded-sm border border-borderColor mt-5 relative overflow-hidden">
		{/* Beautiful top border */}
		<div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-t-xl" />
		<span className="text-lg xl:text-xl font-semibold text-semi-black font-poppins mb-2 mt-2 tracking-wide">
			Top 5 Selling Products
		</span>
		{isLoading ? (
			<span className="text-gray-400 py-8">Loading top products...</span>
		) : topProducts.length === 0 ? (
			<span className="text-gray-400 py-8">No sales in this period.</span>
		) : (
			<ul className="w-full flex flex-col gap-2 mt-2">
				{topProducts.map((prod, idx) => (
					<li
						key={prod.sku}
						className={`flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
							idx === 0
								? "bg-indigo-50 border-l-4 border-indigo-500"
								: "bg-gray-50"
						}`}
					>
						<span className="flex items-center gap-2">
							<span
								className={`inline-flex items-center justify-center w-7 h-7 rounded-full font-bold text-white text-sm ${
									idx === 0 ? "bg-indigo-500" : "bg-gray-300 text-gray-700"
								}`}
							>
								{idx + 1}
							</span>
							<span className="font-mono tracking-wide text-base">
								{prod.sku}
							</span>
						</span>
						<span className="font-semibold text-base text-gray-700">
							{prod.totalSold}
						</span>
					</li>
				))}
			</ul>
		)}
	</div>
);

export default TopSellingProductsCard;
