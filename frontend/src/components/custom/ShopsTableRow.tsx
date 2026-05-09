import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { TShop } from "@/types/Shops";
import ShopInfoCell from "@/components/custom/ShopInfoCell";
import ShopStoreKeyCell from "@/components/custom/ShopStoreKeyCell";
import SocialLinksCell from "@/components/custom/SocialLinksCell";
import MetaAdsCell from "@/components/custom/MetaAdsCell";
import ShopStatusCell from "@/components/custom/ShopStatusCell";
import ActionButtonsCell from "@/components/custom/ActionButtonsCell";

interface ShopsTableRowProps {
	shop: TShop;
	isHovered: boolean;
	onMouseEnter: () => void;
	onMouseLeave: () => void;
	onEdit: () => void;
	onDelete: () => void;
}

const ShopsTableRow: React.FC<ShopsTableRowProps> = ({
	shop,
	isHovered,
	onMouseEnter,
	onMouseLeave,
	onEdit,
	onDelete,
}) => {
	return (
		<TableRow
			key={shop._id}
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
			className={`transition-colors duration-150 ${
				isHovered ? "bg-blue-50 cursor-pointer" : "hover:bg-gray-50"
			}`}
		>
			<TableCell className='px-5 md:pl-8 pr-10 min-w-[250px]'>
				<ShopInfoCell name={shop.name} logoUrl={shop.logo_url} />
			</TableCell>

			<TableCell>
				<ShopStoreKeyCell
					storeKey={shop.shopify_store_key}
					isHovered={isHovered}
				/>
			</TableCell>

			<TableCell>{shop.phone}</TableCell>

			<TableCell>
				<SocialLinksCell shop={shop} />
			</TableCell>

			<TableCell>
				<MetaAdsCell
					metaAdsManagerId={shop.meta_ads_manager_id}
					isHovered={isHovered}
					shopifyStoreKey={shop.shopify_store_key}
				/>
			</TableCell>

			<TableCell>
				<ShopStatusCell status={shop.status} />
			</TableCell>

			<TableCell className='pr-5 md:pr-10'>
				<ActionButtonsCell onEdit={onEdit} onDelete={onDelete} />
			</TableCell>
		</TableRow>
	);
};

export default ShopsTableRow;
