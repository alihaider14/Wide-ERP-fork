import CustomInputField from './CustomInputField';
import { EyeClose, EyeOpen, Lock } from '@/assets/svg';

import { Button } from '../ui/button';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useResetPassword from '@/hooks/useResetPassword';
import CustomLoader from './CustomLoader';
import { useEffect } from 'react';

const ResetForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const {
    resetPasswordMutation,
    setUserData,
    handleChange,
    setShowPassword,
    showPassword,
    handleResetPassword,
    userData,
  } = useResetPassword();

  useEffect(() => {
    if (token) {
      setUserData((prev) => ({
        ...prev,
        token: token ?? undefined,
      }));
    }
  }, [token]);

  return (
    <div className='flex items-center  justify-center min-h-screen w-full'>
      <CustomLoader isLoading={resetPasswordMutation.isPending} />

      <div className='flex w-full max-w-[500px]  flex-col items-center p-5 md:p-0'>
        <div className='flex flex-col gap-2 items-center text-center'>
          <span className='text-[32px] leading-[48px] font-medium text-foreground'>
            Reset Password
          </span>
          <span className='text-sm leading-[21px] text-secondary-foreground'>
            Let's set up a new password for your account
          </span>
        </div>

        <form className='flex flex-col gap-[30px] w-full mt-[50px] mb-4'>
          <CustomInputField
            preIcon={Lock}
            placeholder='Password'
            postIcon={showPassword ? EyeClose : EyeOpen}
            type={showPassword ? 'text' : 'password'}
            onChange={handleChange(setUserData)}
            onViewPassword={() => setShowPassword(!showPassword)}
            value={userData?.newPassword}
            name='newPassword'
          />
          <CustomInputField
            preIcon={Lock}
            placeholder='Confirm Password'
            postIcon={showPassword ? EyeClose : EyeOpen}
            type={showPassword ? 'text' : 'password'}
            onChange={handleChange(setUserData)}
            onViewPassword={() => setShowPassword(!showPassword)}
            value={userData?.confirmPassword}
            name='confirmPassword'
          />
        </form>

        <Button
          className='font-medium text-[14px] h-[44px] w-full mt-8 leading-[100%] bg-primaryDarkBlue text-white hover:bg-primaryDarkBlue/90'
          onClick={handleResetPassword}
          disabled={resetPasswordMutation.isPending}
        >
          Set Password
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

export default ResetForm;
