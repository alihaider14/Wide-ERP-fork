import React, { useState } from 'react';
interface CustomDateInputProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  id?: string;
  name?: string;
}
const formatToDisplay = (dateStr?: string) => {
  return dateStr || '';
};

const CustomDateInput: React.FC<CustomDateInputProps> = ({
  value,
  onChange,
  placeholder = 'DD-MM-YYYY',
  className = '',
  id,
  name,
}) => {
  const [inputValue, setInputValue] = useState(formatToDisplay(value));
  const [error, setError] = useState('');
  React.useEffect(() => {
    setInputValue(value || '');
  }, [value]);
  const isValidDate = (val: string) => {
    return /^\d{2}-\d{2}-\d{4}$/.test(val);
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    if (val && !isValidDate(val)) {
      setError('Please enter a valid date in DD-MM-YYYY format.');
    } else {
      setError('');
    }
    if (onChange) {
      onChange(val);
    }
  };

  return (
    <div className='w-full'>
      <input
        type='text'
        id={id}
        name={name}
        className={className}
        placeholder={placeholder}
        value={inputValue}
        onChange={handleInputChange}
        maxLength={10}
        autoComplete='off'
      />
      {error && <div className='text-xs text-red-500 mt-1'>{error}</div>}
    </div>
  );
};

export default CustomDateInput;
