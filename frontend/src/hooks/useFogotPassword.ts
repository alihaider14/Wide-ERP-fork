
import { handleApiError } from "@/helper/error-function";
import { AuthService } from "@/services";
import { TError } from "@/types/TError";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import { TForgotPassword, TUser } from "@/types/User";

const useForgotPassword = () => {
	const [userData, setUserData] = useState<Partial<TForgotPassword>>({
		email: ""
	});

	const handleChange =
		(setter: React.Dispatch<React.SetStateAction<Partial<TForgotPassword>>>) =>
			(event: React.ChangeEvent<HTMLInputElement>) => {
				setter((prev) => ({
					...prev,
					[event.target.name]: event.target.value,
				}));
			};

	const forgetPasswordMutation = useMutation(({
		mutationFn: AuthService.forgetPassword,
		onSuccess: handleFogotPasswordSuccess,
		onError: handleFogotPasswordError,
	}));

	const handleFogotPassword = () => {
		if (!userData?.email) {
			toast.error("Please fill required field.");
		} else {
			forgetPasswordMutation.mutate(userData?.email);
		}
	};

	function handleFogotPasswordSuccess(data: TUser) {
		if (data) {
			setUserData({ email: "" });
			toast.success("Password reset link sent successful.");
		}
	}

	function handleFogotPasswordError(error: TError) {
		handleApiError(error, "Failed to reset password. please try again.");
	}

	return {
		userData,
		forgetPasswordMutation,
		handleChange,
		handleFogotPassword,
		setUserData,
	};
};
export default useForgotPassword;
