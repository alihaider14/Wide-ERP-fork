import CustomInputField from './CustomInputField';
import { Email } from '@/assets/svg';

import { Button } from '../ui/button';

import { useNavigate } from 'react-router-dom';
import useForgotPassword from '@/hooks/useFogotPassword';
import CustomLoader from './CustomLoader';

const ForgotForm = () => {
  const navigate = useNavigate();
  const {
    handleChange,
    userData,
    handleFogotPassword,
    setUserData,
    forgetPasswordMutation,
  } = useForgotPassword();

  return (
    <div className='flex items-center  justify-center min-h-screen w-full'>
      <CustomLoader isLoading={forgetPasswordMutation.isPending} />

      <div className='flex w-full max-w-[500px]  flex-col items-center p-5 md:p-0'>
        <div className='flex flex-col gap-2 items-center text-center'>
          <span className='text-[32px] leading-[48px] font-medium text-foreground'>
            Forgot Password
          </span>
          <span className='text-sm leading-[21px] text-secondary-foreground'>
            Please enter your email to receive a password reset link
          </span>
        </div>

        <form className='flex flex-col gap-[30px] w-full mt-[50px] mb-4'>
          <CustomInputField
            preIcon={Email}
            placeholder='Email'
            onChange={handleChange(setUserData)}
            value={userData.email}
            name='email'
          />
        </form>

        <Button
          className='font-medium text-[14px] h-[44px] w-full mt-8 leading-[100%] bg-primaryDarkBlue text-white hover:bg-primaryDarkBlue/90'
          onClick={handleFogotPassword}
          disabled={forgetPasswordMutation.isPending}
        >
          Send Link
        </Button>

        <button
          className='font-poppins text-sm text-grey font-medium underline cursor-pointer mt-4'
          onClick={() => navigate('/login')}
        >
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default ForgotForm;
