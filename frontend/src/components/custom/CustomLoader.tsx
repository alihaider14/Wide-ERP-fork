import { Favicon } from "@/assets/svg";
import { COLOR } from "@/constant/Colors";
import { ScaleLoader } from "react-spinners";

type TProps = {
	isLoading: boolean;
};

const CustomLoader = ({ isLoading }: TProps) => {
	return isLoading ? (
		<div className='min-h-screen fixed inset-0 z-50 bg-black/70 flex flex-col gap-5 justify-center items-center'>
			<img src={Favicon} alt='favicon' width={100} height={100} />
			<ScaleLoader loading={isLoading} color={COLOR.grey100} />
		</div>
	) : null;
};

export default CustomLoader;
