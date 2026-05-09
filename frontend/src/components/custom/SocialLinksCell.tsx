import React from "react";
import { socialIconMap } from "@/helper/shopify-utils";

interface SocialLinksCellProps {
	shop: {
		facebook?: string;
		instagram?: string;
		youtube?: string;
		snapchat?: string;
		x?: string;
		[key: string]: unknown;
	};
}

const SocialLinksCell: React.FC<SocialLinksCellProps> = ({ shop }) => {

	return (
		<div className='flex gap-3'>
			{["facebook", "instagram", "youtube", "snapchat", "x"].map((s, i) =>
				shop[s as keyof typeof shop] ? (
					<a
						key={i}
						href={shop[s as keyof typeof shop] as string}
						target='_blank'
						rel='noopener noreferrer'
						className='shrink-0!'
					>
						{socialIconMap[s]}
					</a>
				) : null,
			)}
		</div>
	);
};

export default SocialLinksCell;
