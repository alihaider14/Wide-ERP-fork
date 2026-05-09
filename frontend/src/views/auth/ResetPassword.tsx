import {  LoginLeftContent } from "@/components";
import ResetForm from "@/components/custom/ResetForm";
import { Separator } from "@/components/ui/separator";

const ResetPassword = () => {
	return (
		<div className='flex  items-center justify-center 2xl:justify-normal bg-grey-100 w-full min-h-screen'>
			<LoginLeftContent />

			<Separator orientation='vertical' className='min-h-screen' />

			<ResetForm />
		</div>
	);
};

export default ResetPassword;
