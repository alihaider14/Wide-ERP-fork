import { CustomLoader, Layout, ShopForm } from '@/components';
import useAddShop from '@/hooks/useAddShop';
import { useNavigate } from 'react-router-dom';

const AddShop = () => {
  const { isLoading, shopData, handleChange, handleAddShop, setShopData } =
    useAddShop();
  const navigate = useNavigate();

  return (
    <Layout headerTitle='Add Shop' buttonLabel='Shops' buttonLink='/shops'>
      <CustomLoader isLoading={isLoading} />

      <ShopForm
        onChange={handleChange(setShopData)}
        data={shopData}
        handleSubmit={handleAddShop}
        submitBtnDisabled={isLoading}
        onCancel={() => navigate('/shops')}
      />
    </Layout>
  );
};

export default AddShop;
