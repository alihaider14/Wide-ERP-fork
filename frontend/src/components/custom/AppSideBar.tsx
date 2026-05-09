import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { SIDE_BAR_DATA } from '@/constant/SidebarData';
import { COLOR } from '@/constant/Colors';
import useAccessStore from '@/hooks/useAccessStore';
import toast from 'react-hot-toast';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Separator } from '../ui/separator';
// import CustomSelect from "./CustomSelect";
// import React from "react";
import { Logo } from '@/assets/svg';
import { getUserEmail } from '@/helper/user-utils';

export default function AppSidebar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const hasAccess = useAccessStore((state) => state.hasAccess);

  const userEmail = getUserEmail();

  const checkAccess = (access: string[]) => {
    return access.some((item) => hasAccess(item));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login', { replace: true });
    toast.success('Logout successfull.');
  };

  // --- Shop Switch Dropdown Logic ---
  // const shopList = [{ label: "Daily Wholesale", value: "daily-wholesale" }];
  // const [selectedShop, setSelectedShop] = React.useState<string>(() => {
  // 	return localStorage.getItem("selectedShop") || shopList[0].value;
  // });
  // const handleShopChange = (value: string) => {
  // 	setSelectedShop(value);
  // 	localStorage.setItem("selectedShop", value);
  // };
  // --- End Shop Switch Dropdown Logic ---

  return (
    <Sidebar className='pt-11 '>
      <SidebarHeader className='text-center justify-center items-center w-full  gap-7 mb-[40px]'>
        <Link
          to='/'
          className='text-2xl font-semibold text-blue leading-9 cursor-pointer'
        >
          <img src={Logo} className='w-[170px] h-[36px]' alt='WIDE POS' />
        </Link>

        {/* Shop Switch Dropdown
				<div className="w-full flex justify-center mt-4 mb-2">
					<CustomSelect
						// label="Shop"
						value={selectedShop}
						onValueChange={handleShopChange}
						data={shopList}
						containerClassName="w-full max-w-[260px]"
						placeholder="Select Shop"
					/>
				</div> */}

        <Separator
          className='max-w-[196px]'
          style={{ border: `0.5px solid ${COLOR.borderColor}` }}
        />
      </SidebarHeader>
      <SidebarContent className='pl-10 pr-3'>
        <SidebarMenu>
          {SIDE_BAR_DATA.filter((item) => checkAccess(item.access)).map(
            (item) => {
              const Icon = item.icon;
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild size='lg'>
                    <Link to={item.url} className='flex items-center gap-5'>
                      <Icon
                        color={
                          pathname === item.url ? COLOR.semiBlack : COLOR.grey
                        }
                        style={{
                          width: 24,
                          height: 24,
                        }}
                      />
                      <span
                        style={{
                          color: pathname === item.url ? COLOR.semiBlack : COLOR.grey,
                        }}
                        className={
                          pathname === item.url
                            ? 'sidebar-menu-text-active'
                            : 'sidebar-menu-text'
                        }
                      >
                        {item.title}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            },
          )}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className='mb-[60px] flex flex-col items-center gap-5'>
        <Separator className='max-w-[196px] border-[0.5px] mb-8' style={{ borderColor: COLOR.borderColor }} />
        {userEmail && (
          <div className='text-[14px] font-normal leading-[100%] text-center' style={{ color: COLOR.semiBlack }}>
            {userEmail}
          </div>
        )}
        <div
          className='text-[14px] font-semibold leading-[21px] text-center cursor-pointer'
          style={{ color: COLOR.grey }}
          onClick={handleLogout}
        >
          Logout
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
