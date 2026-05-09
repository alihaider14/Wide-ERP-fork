import { CustomLoader, Layout, UserForm } from '@/components';
import useAddUser from '@/hooks/useAddUser';

const AddUser = () => {
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
    userData,
    navigate,
    handleChange,
    handleAddUser,
  } = useAddUser();

  return (
    <Layout headerTitle='Add User' buttonLabel='Users' buttonLink='/users'>
      <CustomLoader isLoading={isLoading} />

      <UserForm
        productCheckboxData={productCheckboxData}
        orderCheckboxData={orderCheckboxData}
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
        isUpdateUser={false}
        handleChange={handleChange}
        handleSubmit={() => handleAddUser(userData)}
        handleCancel={() => navigate(`/users`)}
      />
    </Layout>
  );
};
export default AddUser;
