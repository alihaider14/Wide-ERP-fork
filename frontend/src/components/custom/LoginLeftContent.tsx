import Logo from '@/assets/svg/logo.svg';
import Login from '@/assets/images/Login.png';
const LoginLeftContent = () => {
  return (
    <div className='xl:flex flex-col items-center justify-between pt-[133px] pb-10 hidden min-h-screen min-w-1/2 bg-white'>
      <div className='flex flex-col gap-2 items-center justify-center text-center'>
        <div className='flex items-center gap-2'>
          <img
            src={Logo}
            alt='Logo Icon'
            width={170}
            height={36}
            style={{ top: '11px', left: '347px' }}
          />
        </div>

        <span
          className='
    font-poppins font-normal text-[16px] leading-[100%] 
    tracking-[0.2em] text-center align-middle uppercase'
        >
          POWERED BY WIDE DIMENSION
        </span>
      </div>
      <img
        src={Login}
        alt='Login Illustration'
        width={500}
        height={500}
        style={{
          opacity: 1,
          transform: 'rotate(0deg)',
        }}
      />
      <span
        className='
    text-foreground 
    w-[221px] h-[21px] 
    text-[14px] 
  '
      >
        © Wide ERP - All rights reserved.
      </span>
    </div>
  );
};
export default LoginLeftContent;
