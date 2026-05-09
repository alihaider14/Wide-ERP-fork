import { Input } from '../ui/input';
import { TreeNode, TUser } from '@/types/User';
import { SearchIcon } from 'lucide-react';
import {
  ORDER_CHECKBOX_DATA,
  PRODUCT_CHECKBOX_DATA,
  USER_CHECKBOX_DATA,
  SHOP_CHECKBOX_DATA,
  SHOPIFY_CHECKBOX_DATA,
  VENDOR_CHECKBOX_DATA,
  COURIER_CHECKBOX_DATA,
  ANALYTICS_CHECKBOX_DATA,
  STOCK_ZONES_CHECKBOX_DATA,
  BILLS_CHECKBOX_DATA,
  PAYMENTS_CHECKBOX_DATA,
  ACTIVITIES_CHECKBOX_DATA,
  BACKGROUND_TASKS_CHECKBOX_DATA,
  DASHBOARD_CHECKBOX_DATA,
  EMPLOYEE_CHECKBOX_DATA,
  ATTENDANCE_CHECKBOX_DATA
} from '@/constant/Checkbox';
import CustomCheckboxTree from './CustomCheckboxTree';
import { useMemo, useState, useCallback } from 'react';
import { filterTree } from '@/lib/filter-checkbox';
import FormActionButtons from './FormActionButtons';
import { Button } from '../ui/button';

type CheckboxTreeHookResult = {
  handleCheck: (node: TreeNode) => void;
  isChecked: (node: TreeNode) => boolean | 'indeterminate';
  checkedNodeKeys: string[];
  resetCheckedNodes: () => void;
};

interface UserFormProps {
  productCheckboxData: CheckboxTreeHookResult;
  orderCheckboxData: CheckboxTreeHookResult;
  userCheckboxData: CheckboxTreeHookResult;
  shopCheckboxData: CheckboxTreeHookResult;
  shopifyCheckboxData: CheckboxTreeHookResult;
  vendorCheckboxData: CheckboxTreeHookResult;
  courierCheckboxData: CheckboxTreeHookResult;
  analyticsCheckBoxData: CheckboxTreeHookResult;
  stockZonesCheckBoxData: CheckboxTreeHookResult;
  billsCheckBoxData: CheckboxTreeHookResult;
  paymentsCheckBoxData: CheckboxTreeHookResult;
  activitiesCheckBoxData: CheckboxTreeHookResult;
  backgroundTasksCheckboxData: CheckboxTreeHookResult;
  dashboardCheckboxData: CheckboxTreeHookResult;
  employeeCheckboxData: CheckboxTreeHookResult;
  attendanceCheckboxData: CheckboxTreeHookResult;
  userData: Partial<TUser>;
  isUpdateUser:Boolean;
  handleUpdateAccess?: () => void;
  handleChange: (
    setter: keyof Partial<TUser>
  ) => (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: () => void;
  handleCancel?: () => void;
}

function UserForm({
  productCheckboxData,
  orderCheckboxData,
  userCheckboxData,
  shopCheckboxData,
  shopifyCheckboxData,
  vendorCheckboxData,
  billsCheckBoxData,
  paymentsCheckBoxData,
  stockZonesCheckBoxData,
  courierCheckboxData,
  analyticsCheckBoxData,
  activitiesCheckBoxData,
  backgroundTasksCheckboxData,
  dashboardCheckboxData,
  employeeCheckboxData,
  attendanceCheckboxData,
  userData,
  isUpdateUser,
  handleChange,
  handleCancel,
  handleSubmit,
  handleUpdateAccess, 
}: UserFormProps) {
  const [searchQuery, setSearchQuery] = useState<string>('');

  const addIdToTree = useCallback(
    (node: TreeNode): TreeNode => ({
      ...node,
      id: node.key,
      children: node.children ? node.children.map(addIdToTree) : [],
    }),
    []
  );

  const {
    filteredProductTree,
    filteredOrderTree,
    filteredUserTree,
    filteredShopTree,
    filteredShopifyTree,
    filteredVendorTree,
    filteredCourierTree,
    filteredBillsTree,
    filteredPaymentsTree,
    filteredStockZonesTree,
    filteredAnalyticsTree,
    filteredActivitiesTree,
    filteredBackgroundTasksTree,
    filteredDashboardTree,
    filteredEmployeeTree,
    filteredAttendanceTree
  } = useMemo(
    () => ({
      filteredProductTree: filterTree(
        addIdToTree(PRODUCT_CHECKBOX_DATA as TreeNode),
        searchQuery
      ),
      filteredOrderTree: filterTree(
        addIdToTree(ORDER_CHECKBOX_DATA as TreeNode),
        searchQuery
      ),
      filteredUserTree: filterTree(
        addIdToTree(USER_CHECKBOX_DATA as TreeNode),
        searchQuery
      ),
      filteredShopTree: filterTree(
        addIdToTree(SHOP_CHECKBOX_DATA as TreeNode),
        searchQuery
      ),
      filteredShopifyTree: filterTree(
        addIdToTree(SHOPIFY_CHECKBOX_DATA as TreeNode),
        searchQuery
      ),
      filteredVendorTree: filterTree(
        addIdToTree(VENDOR_CHECKBOX_DATA as TreeNode),
        searchQuery
      ),
      filteredCourierTree: filterTree(
        addIdToTree(COURIER_CHECKBOX_DATA as TreeNode),
        searchQuery
      ),
      filteredBillsTree: filterTree(
        addIdToTree(BILLS_CHECKBOX_DATA as TreeNode),
        searchQuery
      ),
      filteredPaymentsTree: filterTree(
        addIdToTree(PAYMENTS_CHECKBOX_DATA as TreeNode),
        searchQuery
      ),
      filteredStockZonesTree: filterTree(
        addIdToTree(STOCK_ZONES_CHECKBOX_DATA as TreeNode),
        searchQuery
      ),
      filteredAnalyticsTree: filterTree(
        addIdToTree(ANALYTICS_CHECKBOX_DATA as TreeNode),
        searchQuery
      ),

      filteredActivitiesTree: filterTree(
        addIdToTree(ACTIVITIES_CHECKBOX_DATA as TreeNode),
        searchQuery
      ),

      filteredBackgroundTasksTree: filterTree(
        addIdToTree(BACKGROUND_TASKS_CHECKBOX_DATA as TreeNode),
        searchQuery
      ),

      filteredDashboardTree: filterTree(
        addIdToTree(DASHBOARD_CHECKBOX_DATA as TreeNode),
        searchQuery
      ),

      filteredEmployeeTree: filterTree(
        addIdToTree(EMPLOYEE_CHECKBOX_DATA as TreeNode),
        searchQuery
      ),

      filteredAttendanceTree: filterTree(
        addIdToTree(ATTENDANCE_CHECKBOX_DATA as TreeNode),
        searchQuery
      ),

    }),
    [searchQuery, addIdToTree]
  );

  return (
    <>
      <div className='max-w-[1190px] w-auto flex flex-col gap-6 mt-5 bg-white p-10 rounded-[5px] border border-border'>
        <div className='flex gap-[30px]'>
          <div className='w-[540px] h-[58px]'>
            <Input
              label='Full Name'
              placeholder='Full Name'
              name='full_name'
              value={userData?.full_name || ''}
              onChange={handleChange('full_name')}
              className='pl-4'
            />
          </div>
          <div className='w-[540px] h-[58px]'>
            <Input
              label='Email'
              placeholder='Email'
              name='email'
              type='email'
              value={userData?.email || ''}
              onChange={handleChange('email')}
              className='pl-4'
            />
          </div>
        </div>

        <div className='flex gap-[30px]'>
          <div className='w-[540px] h-[58px]'>
            <Input
              label='Phone'
              placeholder='Phone'
              name='phone'
              type='tel'
              value={userData?.phone || ''}
              onChange={handleChange('phone')}
              className='pl-4'
            />
          </div>
          <div className='w-[540px] h-[58px]'>
            <Input
              label='Password'
              placeholder='Password'
              name='password'
              type='password'
              value={userData?.password || ''}
              onChange={handleChange('password')}
              className='pl-4'
            />
          </div>
        </div>

        <div className='max-w-[1110px] w-auto h-[58px]'>
          <Input
            label='Designation'
            placeholder='Designation'
            name='designation'
            containerClassName='sm:col-span-2'
            value={userData?.designation || ''}
            onChange={handleChange('designation')}
            className='pl-4'
          />
        </div>

        <div className='sm:col-span-2 flex justify-end items-center gap-[30px] max-w-[1110px] w-auto h-9'>
          <FormActionButtons onCancel={handleCancel} onSubmit={handleSubmit} />
        </div>
      </div>

      <div className='sm:col-span-2 max-w-[1190px] flex flex-col gap-6 mt-5 bg-white p-5 rounded-[5px] border border-border'>
      <div className='flex flex-col md:flex-row gap-3 max-w-[1130px]'>
        <div className='relative flex-1'>
          <SearchIcon className='pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10' />
          <Input
            placeholder='Search'
            name='search'
            aria-label='Search'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='
                pl-9 h-9 rounded-[3px]
                border border-borderColor bg-white
                outline-none focus:outline-none
                ring-0 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0
                shadow-none
                '
                style={{ boxShadow: 'none' }}
          />
        </div>
        {isUpdateUser &&
           <Button variant="primary" onClick={handleUpdateAccess} className='w-auto xl:w-87.5 min-w-30 flex-1 xl:flex-none max-w-87.5'>
              Update Access
            </Button>
        }
      </div>

        <div className='flex flex-col gap-4'>
          {filteredDashboardTree && dashboardCheckboxData && (
            <CustomCheckboxTree
              initialTree={filteredDashboardTree}
              handleCheck={dashboardCheckboxData.handleCheck}
              isChecked={dashboardCheckboxData.isChecked}
            />
          )}
          {filteredProductTree && productCheckboxData && (
            <CustomCheckboxTree
              initialTree={filteredProductTree}
              handleCheck={productCheckboxData.handleCheck}
              isChecked={productCheckboxData.isChecked}
            />
          )}
          {filteredOrderTree && orderCheckboxData && (
            <CustomCheckboxTree
              initialTree={filteredOrderTree}
              handleCheck={orderCheckboxData.handleCheck}
              isChecked={orderCheckboxData.isChecked}
            />
          )}
          {filteredUserTree && userCheckboxData && (
            <CustomCheckboxTree
              initialTree={filteredUserTree}
              handleCheck={userCheckboxData.handleCheck}
              isChecked={userCheckboxData.isChecked}
            />
          )}
          {filteredShopTree && shopCheckboxData && (
            <CustomCheckboxTree
              initialTree={filteredShopTree}
              handleCheck={shopCheckboxData.handleCheck}
              isChecked={shopCheckboxData.isChecked}
            />
          )}
          {filteredShopifyTree && shopifyCheckboxData && (
            <CustomCheckboxTree
              initialTree={filteredShopifyTree}
              handleCheck={shopifyCheckboxData.handleCheck}
              isChecked={shopifyCheckboxData.isChecked}
            />
          )}
          {/* Vendors */}
          {filteredVendorTree && vendorCheckboxData && (
            <CustomCheckboxTree
              initialTree={filteredVendorTree}
              handleCheck={vendorCheckboxData.handleCheck}
              isChecked={vendorCheckboxData.isChecked}
            />
          )}
          {/* Couriers */}
          {filteredCourierTree && courierCheckboxData && (
            <CustomCheckboxTree
              initialTree={filteredCourierTree}
              handleCheck={courierCheckboxData.handleCheck}
              isChecked={courierCheckboxData.isChecked}
            />
          )}
          {/* Bills */}
          {filteredBillsTree && billsCheckBoxData && (
            <CustomCheckboxTree
              initialTree={filteredBillsTree}
              handleCheck={billsCheckBoxData.handleCheck}
              isChecked={billsCheckBoxData.isChecked}
            />
          )}

          {/* Payments */}
          {filteredPaymentsTree && paymentsCheckBoxData && (
            <CustomCheckboxTree
              initialTree={filteredPaymentsTree}
              handleCheck={paymentsCheckBoxData.handleCheck}
              isChecked={paymentsCheckBoxData.isChecked}
            />
          )}

          {/* Stock Zones */}
          {filteredStockZonesTree && stockZonesCheckBoxData && (
            <CustomCheckboxTree
              initialTree={filteredStockZonesTree}
              handleCheck={stockZonesCheckBoxData.handleCheck}
              isChecked={stockZonesCheckBoxData.isChecked}
            />
          )}

          {/* Activities */}
          {filteredActivitiesTree && activitiesCheckBoxData && (
            <CustomCheckboxTree
              initialTree={filteredActivitiesTree}
              handleCheck={activitiesCheckBoxData.handleCheck}
              isChecked={activitiesCheckBoxData.isChecked}
            />
          )}

          {/* Analytics */}
          {filteredAnalyticsTree && analyticsCheckBoxData && (
            <CustomCheckboxTree
              initialTree={filteredAnalyticsTree}
              handleCheck={analyticsCheckBoxData.handleCheck}
              isChecked={analyticsCheckBoxData.isChecked}
            />
          )}

          {/* Analytics */}
          {filteredBackgroundTasksTree && backgroundTasksCheckboxData && (
            <CustomCheckboxTree
              initialTree={filteredBackgroundTasksTree}
              handleCheck={backgroundTasksCheckboxData.handleCheck}
              isChecked={backgroundTasksCheckboxData.isChecked}
            />
          )}

          {filteredEmployeeTree && employeeCheckboxData && (
            <CustomCheckboxTree
              initialTree={filteredEmployeeTree}
              handleCheck={employeeCheckboxData.handleCheck}
              isChecked={employeeCheckboxData.isChecked}
            />
          )}

          {filteredAttendanceTree && attendanceCheckboxData && (
            <CustomCheckboxTree
              initialTree={filteredAttendanceTree}
              handleCheck={attendanceCheckboxData.handleCheck}
              isChecked={attendanceCheckboxData.isChecked}
            />
          )}

        </div>
      </div>
    </>
  );
}

export default UserForm;
