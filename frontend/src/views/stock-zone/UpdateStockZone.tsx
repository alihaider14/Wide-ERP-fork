import { CustomLoader, Layout, StockZoneForm } from '@/components';
import useUpdateStockZone from '@/hooks/useUpdateStockZone';

const UpdateStockZone = () => {
    const {
        isLoading,
        stockZoneData,
        setStockZoneData,
        handleChange,
        handleSubmit
    } = useUpdateStockZone();

    return (
        <Layout headerTitle='Update Stock Zone' buttonLabel='Stock Zones' buttonLink='/stock-zone'>
            <CustomLoader isLoading={isLoading} />

            <StockZoneForm
                stockZoneData={stockZoneData}
                setUserData={setStockZoneData}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
            />
        </Layout>
    );
};
export default UpdateStockZone;
