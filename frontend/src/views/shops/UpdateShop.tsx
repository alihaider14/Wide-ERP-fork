import { CustomLoader, Layout, ShopForm } from '@/components';
import useUpdateShop from '@/hooks/useUpdateShop';
import { useParams, useNavigate } from 'react-router-dom';

const UpdateShop = () => {
  const { id } = useParams();
  const { isLoading, shopData, handleChange, handleUpdateShop } = useUpdateShop(id);
  const navigate = useNavigate();

  return (
    <Layout headerTitle='Update Shop' buttonLabel='Shops' buttonLink='/shops'>
      <CustomLoader isLoading={isLoading} />

      <ShopForm
        onChange={handleChange}
        data={shopData}
        handleSubmit={() => handleUpdateShop(navigate)}
        submitBtnDisabled={isLoading}
        onCancel={() => navigate('/shops')}
        isUpdate={true}
      />
    </Layout>
  );
};

export default UpdateShop;
