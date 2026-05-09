import { Input } from '../ui/input';
import { useNavigate } from 'react-router-dom';
import FormActionButtons from '../custom/FormActionButtons';

export interface StockZoneData {
  name: string;
}

interface StockZoneFormProps {
  stockZoneData: Partial<StockZoneData>;
  setUserData: React.Dispatch<React.SetStateAction<Partial<StockZoneData>>>;
  handleChange: (setter: React.Dispatch<React.SetStateAction<Partial<StockZoneData>>>) => (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: () => void;
}

function StockZoneForm({
  stockZoneData,
  setUserData,
  handleChange,
  handleSubmit
}: StockZoneFormProps) {
  const navigate = useNavigate();

  return (
    <div className='max-w-[810px] w-auto flex flex-col gap-6 mt-5 bg-white p-[40px] rounded-[5px] border border-border'>
      <div className='max-w-[810px] w-auto h-[58px]'>
        <Input
          label='Stock Zone'
          placeholder='Stock Zone'
          name='name'
          containerClassName='sm:col-span-2'
          value={stockZoneData?.name || ''}
          onChange={handleChange(setUserData)}
          className="pl-4"
        />
      </div>

      <FormActionButtons
        onSubmit={handleSubmit}
        onCancel={() => navigate(-1)}
      />
    </div>
  );
}

export default StockZoneForm;