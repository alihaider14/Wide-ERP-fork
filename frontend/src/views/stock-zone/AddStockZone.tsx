import { CustomLoader, Layout, StockZoneForm } from '@/components';
import useAddStockZone from '@/hooks/useAddStockZone';

const AddStockZone = () => {
    const {
        isLoading,
        stockZoneData,
        setStockZoneData,
        handleChange,
        handleAddStockZone
    } = useAddStockZone();


    const handleSubmit = () => {
        handleAddStockZone(stockZoneData);
    };

    return (
        <Layout headerTitle='Add Stock Zone' buttonLabel='Stock Zones' buttonLink='/stock-zone'>
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
export default AddStockZone;
