import { handleApiError } from '@/helper/error-function';
import { UserService } from '@/services';
import { TAddAndUpdateUserResponse, TUser } from '@/types/User';
import { TError } from '@/types/TError';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { useCheckboxTree } from '@/components/ui/checkbox-tree';
import {
  PRODUCT_CHECKBOX_DATA,
  ORDER_CHECKBOX_DATA,
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
import useAccessStore from './useAccessStore';
import { updateUserAccessSchema, updateUserSchema } from '@/validations/user.schema';

const useUpdateUser = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<Partial<TUser>>({});
  const { userId, setAccess } = useAccessStore((state) => state);

  const { data, isLoading: isUserByIdLoading } = useQuery({
    queryKey: [`userById/${id}`, id],
    queryFn: () => UserService.userById(id),
    enabled: !!id,
  });
  // Use checkbox tree directly
  const productCheckboxData = useCheckboxTree(
    PRODUCT_CHECKBOX_DATA,
    data?.user?.access
  );
  const orderCheckboxData = useCheckboxTree(
    ORDER_CHECKBOX_DATA,
    data?.user?.access
  );
  const userCheckboxData = useCheckboxTree(
    USER_CHECKBOX_DATA,
    data?.user?.access
  );
  const shopCheckboxData = useCheckboxTree(
    SHOP_CHECKBOX_DATA,
    data?.user?.access
  );
  const shopifyCheckboxData = useCheckboxTree(
    SHOPIFY_CHECKBOX_DATA,
    data?.user?.access
  );
  const vendorCheckboxData = useCheckboxTree(
    VENDOR_CHECKBOX_DATA,
    data?.user?.access
  );
  const courierCheckboxData = useCheckboxTree(
    COURIER_CHECKBOX_DATA,
    data?.user?.access
  );
  const analyticsCheckBoxData = useCheckboxTree(
    ANALYTICS_CHECKBOX_DATA,
    data?.user?.access
  );
  const stockZonesCheckBoxData = useCheckboxTree(
    STOCK_ZONES_CHECKBOX_DATA,
    data?.user?.access
  );

  const billsCheckBoxData = useCheckboxTree(
    BILLS_CHECKBOX_DATA,
    data?.user?.access
  )

  const paymentsCheckBoxData = useCheckboxTree(
    PAYMENTS_CHECKBOX_DATA,
    data?.user?.access
  )

  const activitiesCheckBoxData = useCheckboxTree(
    ACTIVITIES_CHECKBOX_DATA,
    data?.user?.access
  )
  
  const backgroundTasksCheckBoxData = useCheckboxTree(
    BACKGROUND_TASKS_CHECKBOX_DATA,
    data?.user?.access
  )

  const dashboardCheckboxData = useCheckboxTree(
    DASHBOARD_CHECKBOX_DATA,
    data?.user?.access
  )

  const employeeCheckboxData = useCheckboxTree(
    EMPLOYEE_CHECKBOX_DATA,
    data?.user?.access
  )

  const attendanceCheckboxData = useCheckboxTree(
    ATTENDANCE_CHECKBOX_DATA,
    data?.user?.access
  )

  const access = useMemo(() => {
    return [
      ...productCheckboxData.checkedNodeKeys,
      ...orderCheckboxData.checkedNodeKeys,
      ...userCheckboxData.checkedNodeKeys,
      ...shopCheckboxData.checkedNodeKeys,
      ...shopifyCheckboxData.checkedNodeKeys,
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
    productCheckboxData.checkedNodeKeys,
    orderCheckboxData.checkedNodeKeys,
    userCheckboxData.checkedNodeKeys,
    shopCheckboxData.checkedNodeKeys,
    shopifyCheckboxData.checkedNodeKeys,
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

  useEffect(() => {
    if (data) {
      setUserData({ ...data?.user, password: '' });
    }
  }, [data]);

  const handleChange =
    (setter: keyof Partial<TUser>) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setUserData((prev) => ({
        ...prev,
        [setter]: event.target.value,
      }));
    };

  const updateUserMutation = useMutation({
    mutationFn: UserService.updateUser,
    onSuccess: handleUpdateUserSuccess,
    onError: handleUpdateUserError,
  });

  const handleUpdateUser = () => {
    const parseResult = updateUserSchema.safeParse({ ...userData });
    if (!parseResult.success) {
      toast.error(parseResult.error.errors[0]?.message || 'Validation error');
      return;
    }
    setLoading(true);
    updateUserMutation.mutate({ ...userData });
  };

  function handleUpdateUserSuccess(_data: TAddAndUpdateUserResponse) {

    toast.success('User updated successfully.');
    setLoading(false);
    navigate('/users');
  }

  function handleUpdateUserError(error: TError) {
    setLoading(false);
    handleApiError(error, 'Failed to update user. Please try again.');
  }

  const updateAccessMutation = useMutation({
  mutationFn: UserService.updateUserAccess,
  onSuccess: handleUpdateAccessSuccess,
  onError: handleUpdateAccessError,
 });

  const handleUpdateAccess = () => {
    const parseResult = updateUserAccessSchema.safeParse({ _id: userData._id, access });
    if (!parseResult.success) {
      toast.error(parseResult.error.errors[0]?.message || 'Validation error');
      return;
    }
    setLoading(true);
    updateAccessMutation.mutate({ _id: userData._id, access });
  };

  function handleUpdateAccessSuccess(data: TAddAndUpdateUserResponse) {
    const { access, _id } = data.user;
    if (userId === id) setAccess(access, _id);
    toast.success('Access updated successfully.');
    setLoading(false);
    navigate('/users');
  }

  function handleUpdateAccessError(error: TError) {
    setLoading(false);
    handleApiError(error, 'Failed to update access. Please try again.');
  }

  const isLoading =
    updateUserMutation.isPending || updateAccessMutation.isPending || loading || isUserByIdLoading;

  const isDetailsUnchanged  =
    userData.full_name === data?.user?.full_name &&
    userData.email === data?.user?.email &&
    userData.phone === data?.user?.phone &&
    userData.designation === data?.user?.designation &&
    (userData.password === '' || userData.password === data?.user?.password);

    const isAccessUnchanged =
      JSON.stringify(data?.user?.access?.slice().sort()) ===
      JSON.stringify(access.slice().sort());

  return {
    isLoading,
    userData,
    productCheckboxData,
    orderCheckboxData,
    userCheckboxData,
    shopCheckboxData,
    shopifyCheckboxData,
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
    handleUpdateUser,
    setUserData,
    isDetailsUnchanged ,
    handleUpdateAccess,
    isAccessUnchanged
  };
};

export default useUpdateUser;
