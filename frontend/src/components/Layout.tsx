import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDownIcon } from "lucide-react";
import AppSidebar from "./custom/AppSideBar";
import { SidebarProvider, SidebarTrigger } from "./ui/sidebar";
import { Chevron, Logo, Shops } from "@/assets/svg";
import { cn } from "@/lib/utils";

type TShopKey = {
	_id?: string;
	name: string;
	shopify_store_key: string;
	shopify_api_key: string;
};

type TProps = {
	children: React.ReactNode;
	headerTitle?: string;
	buttonLabel?: string;
	buttonLink?: string;
	shopList?: TShopKey[];
	selectedShop?: string;
	setSelectedShop?: (shop: string) => void;
	hideSidebar?: boolean;
	mainLayoutContainerClassName?: string;
	clearSelection?: () => void;
};

const Layout = ({
	children,
	headerTitle,
	buttonLabel,
	buttonLink,
	shopList,
	selectedShop,
	setSelectedShop,
	hideSidebar = false,
	mainLayoutContainerClassName,
	clearSelection,
}: TProps) => {
	const [dropdownOpen, setDropdownOpen] = useState(false);

	return (
		<SidebarProvider>
			{!hideSidebar && <AppSidebar />}

			<main className=' bg-grey-100 flex-1 overflow-hidden flex flex-col'>
				<div className='p-5 flex justify-between items-center md:hidden mb-5'>
					<Link
						to='/'
						className='text-2xl font-semibold text-blue leading-9 cursor-pointer'
					>
						<img src={Logo} alt='WIDE ERP' />
					</Link>
					<SidebarTrigger className='cursor-pointer' />
				</div>
				<div className='relative hidden h-12.5 w-full items-center justify-between border-b border-borderColor bg-white px-5 md:flex md:px-12.5'>
					<h1 className='m-0 text-sm font-semibold leading-[100%] tracking-[0] text-semi-black'>
						{headerTitle}
					</h1>
					<div className='flex items-center gap-2'>
						{shopList && selectedShop !== undefined && setSelectedShop ? (
							<>
								<div className='relative'>
									<button
										type='button'
										className='flex h-5.25 cursor-pointer items-center gap-2 rounded border-none bg-white p-0 text-sm font-normal leading-[100%] tracking-[0] text-semi-black shadow-none outline-none'
										onClick={() => setDropdownOpen((prev) => !prev)}
									>
										<Shops className='h-4 w-4 shrink-0' />
										<span className='whitespace-nowrap'>{selectedShop}</span>
										<ChevronDownIcon
											size={14}
											className='shrink-0 text-semi-black'
										/>
									</button>
									{dropdownOpen && (
										<ul className='absolute top-full right-0 z-10 m-0 mt-1 max-h-50 min-w-full w-max list-none overflow-y-auto rounded-[3px] border border-borderColor bg-white p-0 shadow-none'>
											{shopList.map((shop) => (
												<li
													key={shop._id}
													className='cursor-pointer whitespace-nowrap px-3 py-2 text-sm font-normal leading-[100%] tracking-[0] text-semi-black'
													onClick={() => {
														setSelectedShop(shop.name);
														clearSelection?.();
														setDropdownOpen(false);
													}}
												>
													{shop.name}
												</li>
											))}
										</ul>
									)}
								</div>
							</>
						) : null}
						{buttonLink ? (
							<Link
								to={buttonLink}
								className='flex items-center gap-3.5 hover:bg-accent hover:text-accent-foreground cursor-pointer h-9 px-2 py-1 sm:px-4 sm:py-2 rounded-sm'
							>
								<img src={Chevron} alt='arrow-left' width={24} height={24} />
								<span className='text-grey font-medium text-sm leading-5.25 text-nowrap'>
									{buttonLabel}
								</span>
							</Link>
						) : null}
					</div>
				</div>

				<div
					className={cn(
						`p-5 md:p-10 flex-1 flex flex-col `,
						mainLayoutContainerClassName,
					)}
				>
					{children}
				</div>
			</main>
		</SidebarProvider>
	);
};

export default Layout;
