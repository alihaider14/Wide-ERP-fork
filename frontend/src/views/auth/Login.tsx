import { LoginForm, LoginLeftContent } from "@/components";
import { Separator } from "@/components/ui/separator";

const Login = () => {
	return (
		<div className='flex  items-center justify-center 2xl:justify-normal bg-grey-100 w-full min-h-screen'>
			<LoginLeftContent />

			<Separator orientation='vertical' className='min-h-screen' />

			<LoginForm />
		</div>
	);
};

export default Login;
