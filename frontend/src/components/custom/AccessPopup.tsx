import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { TUser } from "@/types/User";
import { Input } from "../ui/input";
import { useMemo, useState } from "react";
import ModuleAccess from "./ModuleAccess";
import { ACCESS_MAP } from "@/constant/Checkbox";
import { Search as SearchIcon } from "lucide-react";


type TProps = {
	open: boolean;
	handleCancel?: () => void;
	data: TUser;
};

const AccessPopup = ({ open, handleCancel, data }: TProps) => {
	const [searchQuery, setSearchQuery] = useState("");

	const categorizedAccess = useMemo(() => {
		const groupedAccess: { [key: string]: string[] } = {};
		(data?.access || [])?.forEach((key) => {
			const accessInfo = ACCESS_MAP[key];
			if (accessInfo) {
				const { parent, label } = accessInfo;
				if (!groupedAccess[parent]) {
					groupedAccess[parent] = [];
				}
				groupedAccess[parent].push(label);
			}
		});
		return groupedAccess;
	}, [data?.access]);

	const filteredAccess = useMemo(() => {
		if (!searchQuery) return categorizedAccess;

		const lowerCaseQuery = searchQuery.toLowerCase();
		const filtered: { [key: string]: string[] } = {};

		Object.entries(categorizedAccess).forEach(([category, labels]) => {
			const filteredLabels = labels.filter((label) =>
				label.toLowerCase().includes(lowerCaseQuery),
			);

			if (filteredLabels.length > 0) {
				filtered[category] = filteredLabels;
			}
		});

		return filtered;
	}, [searchQuery, categorizedAccess]);

	return (
		<Dialog open={open} onOpenChange={handleCancel}>
			<DialogContent
				className='sm:max-w-[611px] p-10 gap-10 overflow-hidden '
				aria-describedby={undefined}
				onClose={handleCancel}
			>
				<div className='flex flex-col gap-2 sticky top-0'>
					<DialogTitle className='text-center font-semibold text-xs tracking-wider uppercase text-foreground'>
						[{data?.user_id ?? "USER ID"}] - [{data?.full_name ?? "NAME"}]
					</DialogTitle>

					<div className="relative">
						<SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
						<Input
							placeholder="Search"
							name="search"
							aria-label="Search"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="
                                         pl-9 h-9 rounded-[3px] border border-borderColor bg-white outline-none focus:outline-none ring-0 focus:ring-0 focus-visible:ring-0 focus-visible:ring-off shadow-none"
							style={{ boxShadow: "none" }}        /* ensure no shadow on some setups */
						/>

					</div>
				</div>


				<div className='grid sm:grid-cols-2 gap-x-[30px] gap-y-10 max-h-[60vh] overflow-y-auto'>
					{Object.entries(filteredAccess).length > 0 ? (
						Object.entries(filteredAccess).map(([category, labels]) => (
							<ModuleAccess key={category} title={category} access={labels} />
						))
					) : (
						<p className='text-center text-grey col-span-2'>No results found</p>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default AccessPopup;
