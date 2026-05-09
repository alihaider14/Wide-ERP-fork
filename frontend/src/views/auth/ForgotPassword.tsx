import {  LoginLeftContent } from "@/components";
import ForgotForm from "@/components/custom/ForgotForm";
import { Separator } from "@/components/ui/separator";

const ForgotPassword = () => {
	return (
		<div className='flex  items-center justify-center 2xl:justify-normal bg-grey-100 w-full min-h-screen'>
			<LoginLeftContent />

			<Separator orientation='vertical' className='min-h-screen' />

			<ForgotForm />
		</div>
	);
};

export default ForgotPassword;
