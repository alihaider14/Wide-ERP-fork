import CustomInputField from './CustomInputField';
import { Email, EyeClose, EyeOpen, Lock } from '@/assets/svg';

import { Button } from '../ui/button';

import CustomLoader from './CustomLoader';

import useLogin from '@/hooks/useLogin';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const navigate = useNavigate();
  const {
    showPassword,
    userData,
    signInMutation,
    setShowPassword,
    handleChange,
    handleSignIn,
    setUserData,
  } = useLogin();

  return (
    <div className='flex items-center  justify-center min-h-screen w-full'>
      <CustomLoader isLoading={signInMutation.isPending} />

      <div className='flex w-full max-w-[500px]  flex-col items-center p-5 md:p-0'>
        <div className='flex flex-col gap-2 items-center text-center'>
          <span className='text-[32px] leading-[48px] font-popins text-foreground'>
            Hi 👋 Welcome Back!
          </span>
          <span className='text-sm leading-[21px] text-secondary-foreground'>
            Please sign-in to your account and start the adventure
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
          <CustomInputField
            preIcon={Lock}
            placeholder='Password'
            postIcon={showPassword ? EyeClose : EyeOpen}
            type={showPassword ? 'text' : 'password'}
            onChange={handleChange(setUserData)}
            value={userData.password}
            onViewPassword={() => setShowPassword(!showPassword)}
            name='password'
          />
        </form>

        <button
          onClick={() => navigate('/forgot-password')}
          className='self-end text-sm leading-[21px] text-secondary-foreground font-medium underline cursor-pointer'
        >
          Forgot Password
        </button>
        <Button
          className='font-medium text-[14px] h-[44px] w-full mt-8 leading-[100%] bg-primaryDarkBlue text-white hover:bg-primaryDarkBlue/90'
          onClick={handleSignIn}
          disabled={signInMutation.isPending}
        >
          Login
        </Button>
      </div>
    </div>
  );
};

export default LoginForm;
