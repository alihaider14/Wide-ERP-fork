import { CustomLoader, Layout, UserForm } from '@/components';
import useUpdateUser from '@/hooks/useUpdateUser';
const UpdateUser = () => {
  const {
    isLoading,
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
    userData,
    handleChange,
    handleUpdateUser,
    handleUpdateAccess,
  } = useUpdateUser();

  return (
    <Layout headerTitle='Update User' buttonLabel='Users' buttonLink='/users'>
      <CustomLoader isLoading={isLoading} />
      <UserForm
        orderCheckboxData={orderCheckboxData}
        productCheckboxData={productCheckboxData}
        userCheckboxData={userCheckboxData}
        shopCheckboxData={shopCheckboxData}
        shopifyCheckboxData={shopifyCheckboxData}
        vendorCheckboxData={vendorCheckboxData}
        courierCheckboxData={courierCheckboxData}
        analyticsCheckBoxData={analyticsCheckBoxData}
        stockZonesCheckBoxData={stockZonesCheckBoxData}
        billsCheckBoxData={billsCheckBoxData}
        paymentsCheckBoxData={paymentsCheckBoxData}
        activitiesCheckBoxData={activitiesCheckBoxData}
        backgroundTasksCheckboxData={backgroundTasksCheckBoxData}
        dashboardCheckboxData={dashboardCheckboxData}
        employeeCheckboxData={employeeCheckboxData}
        attendanceCheckboxData={attendanceCheckboxData}
        userData={userData}
        handleChange={handleChange}
        handleSubmit={handleUpdateUser}
        handleCancel={() => navigate(`/users`)}
        isUpdateUser={true}
        handleUpdateAccess={handleUpdateAccess}
      />
    </Layout>
  );
};

export default UpdateUser;
