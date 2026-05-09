import { handleApiError } from '@/helper/error-function';
import { UserService } from '@/services';
import { TUser } from '@/types/User';
import { TError } from '@/types/TError';
import { useMutation } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useCheckboxTree } from '@/components/ui/checkbox-tree';
import { addUserSchema } from '@/validations/user.schema';
import {
    ORDER_CHECKBOX_DATA,
  PRODUCT_CHECKBOX_DATA,
  SHOPIFY_CHECKBOX_DATA,
  SHOP_CHECKBOX_DATA,
  USER_CHECKBOX_DATA,
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

const useAddUser = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<Partial<TUser>>({});
  const productCheckboxData = useCheckboxTree(PRODUCT_CHECKBOX_DATA);
  const orderCheckboxData = useCheckboxTree(ORDER_CHECKBOX_DATA);
  const userCheckboxData = useCheckboxTree(USER_CHECKBOX_DATA);
  const shopifyCheckboxData = useCheckboxTree(SHOPIFY_CHECKBOX_DATA);
  const shopCheckboxData = useCheckboxTree(SHOP_CHECKBOX_DATA);
  const vendorCheckboxData = useCheckboxTree(VENDOR_CHECKBOX_DATA);
  const courierCheckboxData = useCheckboxTree(COURIER_CHECKBOX_DATA);
  const analyticsCheckBoxData = useCheckboxTree(ANALYTICS_CHECKBOX_DATA);
  const stockZonesCheckBoxData = useCheckboxTree(STOCK_ZONES_CHECKBOX_DATA);
  const billsCheckBoxData = useCheckboxTree(BILLS_CHECKBOX_DATA);
  const paymentsCheckBoxData = useCheckboxTree(PAYMENTS_CHECKBOX_DATA);
  const activitiesCheckBoxData = useCheckboxTree(ACTIVITIES_CHECKBOX_DATA);
  const backgroundTasksCheckBoxData = useCheckboxTree(BACKGROUND_TASKS_CHECKBOX_DATA);
  const dashboardCheckboxData = useCheckboxTree(DASHBOARD_CHECKBOX_DATA);
  const employeeCheckboxData = useCheckboxTree(EMPLOYEE_CHECKBOX_DATA);
  const attendanceCheckboxData = useCheckboxTree(ATTENDANCE_CHECKBOX_DATA);

  const access = useMemo(() => {
    return [
      ...productCheckboxData.checkedNodeKeys,
      ...orderCheckboxData.checkedNodeKeys,
      ...userCheckboxData.checkedNodeKeys,
      ...shopifyCheckboxData.checkedNodeKeys,
      ...shopCheckboxData.checkedNodeKeys,
      ...vendorCheckboxData.checkedNodeKeys,
      ...courierCheckboxData.checkedNodeKeys,
      ...analyticsCheckBoxData.checkedNodeKeys,
      ...stockZonesCheckBoxData.checkedNodeKeys,
      ...billsCheckBoxData.checkedNodeKeys,
      ...paymentsCheckBoxData.checkedNodeKeys,
      ...activitiesCheckBoxData.checkedNodeKeys,
      ...backgroundTasksCheckBoxData.checkedNodeKeys,
      ...dashboardCheckboxData.checkedNodeKeys,
      ...employeeCheckboxData.checkedNodeKeys,
      ...attendanceCheckboxData.checkedNodeKeys
    ];
  }, [
    orderCheckboxData.checkedNodeKeys,
    productCheckboxData.checkedNodeKeys,
    userCheckboxData.checkedNodeKeys,
    shopifyCheckboxData.checkedNodeKeys,
    shopCheckboxData.checkedNodeKeys,
    vendorCheckboxData.checkedNodeKeys,
    courierCheckboxData.checkedNodeKeys,
    analyticsCheckBoxData.checkedNodeKeys,
    stockZonesCheckBoxData.checkedNodeKeys,
    billsCheckBoxData.checkedNodeKeys,
    paymentsCheckBoxData.checkedNodeKeys,
    activitiesCheckBoxData.checkedNodeKeys,
    backgroundTasksCheckBoxData.checkedNodeKeys,
    dashboardCheckboxData.checkedNodeKeys,
    employeeCheckboxData.checkedNodeKeys,
    attendanceCheckboxData.checkedNodeKeys
  ]);

  const handleChange =
    (setter: keyof Partial<TUser>) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setUserData((prev) => ({
        ...prev,
        [setter]: event.target.value,
      }));
    };

  const addUserMutation = useMutation({
    mutationFn: UserService.addUser,
    onSuccess: handleAddUserSuccess,
    onError: handleAddUserError,
  });

  const handleAddUser = (userData: Partial<TUser>) => {
    const parseResult = addUserSchema.safeParse({ ...userData, access });
    if (!parseResult.success) {
      toast.error(parseResult.error.errors[0]?.message || 'Validation error');
      return;
    }
    setLoading(true);
    addUserMutation.mutate({ ...userData, access });
  };

  function handleAddUserSuccess() {
    toast.success('User added successfully.');
    setLoading(false);
    setUserData({});
    productCheckboxData.resetCheckedNodes();
    orderCheckboxData.resetCheckedNodes();
    userCheckboxData.resetCheckedNodes();
    shopifyCheckboxData.resetCheckedNodes();
    shopCheckboxData.resetCheckedNodes();
    vendorCheckboxData.resetCheckedNodes();
    courierCheckboxData.resetCheckedNodes();
    analyticsCheckBoxData.resetCheckedNodes();
    stockZonesCheckBoxData.resetCheckedNodes();
    billsCheckBoxData.resetCheckedNodes();
    paymentsCheckBoxData.resetCheckedNodes();
    activitiesCheckBoxData.resetCheckedNodes();
    backgroundTasksCheckBoxData.resetCheckedNodes();
    dashboardCheckboxData.resetCheckedNodes();
    employeeCheckboxData.resetCheckedNodes();
    attendanceCheckboxData.resetCheckedNodes();
  }

  function handleAddUserError(error: TError) {
    setLoading(false);
    handleApiError(error, 'Failed to add user. Please try again.');
  }

  const isLoading = addUserMutation.isPending || loading;

  return {
    isLoading,
    userData,
    productCheckboxData,
    orderCheckboxData,
    userCheckboxData,
    shopifyCheckboxData,
    shopCheckboxData,
    vendorCheckboxData,
    courierCheckboxData,
    analyticsCheckBoxData,
    stockZonesCheckBoxData,
    billsCheckBoxData,
    paymentsCheckBoxData,
    activitiesCheckBoxData,
    backgroundTasksCheckBoxData,
    dashboardCheckboxData,
    employeeCheckboxData,
    attendanceCheckboxData,
    navigate,
    handleChange,
    handleAddUser,
  };
};
export default useAddUser;
