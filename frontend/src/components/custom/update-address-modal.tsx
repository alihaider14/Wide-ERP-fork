import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import countriesData from '@/constant/Countries.json';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Input } from '../ui/input';
import CustomAutocomplete from './CustomAutocomplete';

type Props = {
    open: boolean;
    orderNo: string;
    customer: string;
    initialValue?: string;
    initialAddress2?: string;
    initialZip?: string;
    onClose: () => void;
    onSave: (address: { address1: string; address2?: string; city: string; zip?: string; country: string }) => void;
};

export default function UpdateAddressModal({
    open,
    orderNo,
    customer,
    initialValue,
    initialAddress2,
    initialZip,
    onClose,
    onSave,
}: Props) {
    const [address, setAddress] = useState('');
    const [apartment, setApartment] = useState('');
    const [city, setCity] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [country, setCountry] = useState('');

    useEffect(() => {
        if (open) {
            if (initialValue) {
                const parts = initialValue.split(',').map((p) => p.trim()).filter(Boolean);
                if (parts.length >= 3) {
                    setCountry(parts[parts.length - 1] || '');
                    setCity(parts[parts.length - 2] || '');
                    setAddress(parts.slice(0, parts.length - 2).join(', ') || '');
                } else {
                    setAddress(initialValue);
                    setCity('');
                    setCountry('');
                }
            } else {
                setAddress('');
                setCity('');
                setCountry('');
            }
            setApartment(initialAddress2 || '');
            setPostalCode(initialZip || '');
        } else {
            setAddress('');
            setApartment('');
            setCity('');
            setPostalCode('');
            setCountry('');
        }
    }, [open, initialValue, initialAddress2, initialZip]);

    const validateForm = (): boolean => {
        if (!address.trim()) {
            toast.error('Address is required');
            return false;
        }
        if (!city.trim()) {
            toast.error('City is required');
            return false;
        }
        if (!country.trim()) {
            toast.error('Country is required');
            return false;
        }
        return true;
    };

    const handleSubmit = () => {
        if (!validateForm()) return;
        
        const addressData: { address1: string; address2?: string; city: string; zip?: string; country: string } = {
            address1: address.trim(),
            city: city.trim(),
            country: country.trim(),
        };

        if (apartment.trim()) {
            addressData.address2 = apartment.trim();
        }

        if (postalCode.trim()) {
            addressData.zip = postalCode.trim();
        }

        onSave(addressData);
    };

    return (
        <Dialog open={open} onOpenChange={(o) => (!o ? onClose() : null)}>
            <DialogContent className='md:min-w-[760px] rounded-[5px] bg-white overflow-visible p-5 flex flex-col justify-between'>
                <div className='relative flex py-0.5 items-center justify-center'>
                    <span className='text-sm font-semibold absolute left-0'>{orderNo}</span>
                    <span className='text-sm font-medium text-center text-black max-w-[70%]'>
                        {customer}
                    </span>
                </div>

                <div className='grid w-full col-span-1 md:grid-cols-2 gap-5 items-center overflow-visible'>
                    <Input
                        placeholder='Address'
                        name='Address'
                        label='Address'
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        containerClassName='md:col-span-2'
                    />
                    <Input
                        placeholder='Apartment, suite, etc'
                        name='Apartment'
                        label='Apartment, suite, etc'
                        value={apartment}
                        onChange={(e) => setApartment(e.target.value)}
                    />
                    <Input
                        placeholder='City'
                        name='City'
                        label='City'
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                    />
                    <Input
                        placeholder='Postal Code'
                        name='Postal_Code'
                        label='Postal Code'
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                    />
                    <CustomAutocomplete
                        data={countriesData.map(c => ({ name: c.country, id: c.country }))}
                        placeholder="Country"
                        label="Country"
                        name="country"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        handleSelect={(item) => setCountry(item.id)}
                    />
                </div>

                <div className='mt-3 flex justify-end'>
                    <Button
                        className='h-9 px-4 min-w-[140px] whitespace-nowrap rounded-[3px] bg-primaryDarkBlue font-poppins font-medium text-[14px] text-white border-none shadow-none cursor-pointer'
                        onClick={handleSubmit}
                    >
                        Update Address
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
