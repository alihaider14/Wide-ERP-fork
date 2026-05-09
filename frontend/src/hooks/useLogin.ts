import { handleApiError } from "@/helper/error-function";
import { AuthService } from "@/services";
import { TError } from "@/types/TError";
import { TSignInResponse, TUser } from "@/types/User";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import useAccessStore from "./useAccessStore";
import {
	dashboardAccessList,
	orderAccessList,
	productAccessList,
	userAccessList,
} from "@/constant/SidebarData";

const useLogin = () => {
	const navigate = useNavigate();
	const [showPassword, setShowPassword] = useState(false);
	const [userData, setUserData] = useState<Partial<TUser>>({
		email: "",
		password: "",
	});
	const { setAccess } = useAccessStore();

	function checkAccessList(
		userAccess: string[],
		accessList: string[],
	): boolean {
		return accessList.some((access) => userAccess.includes(access));
	}

	const handleChange =
		(setter: React.Dispatch<React.SetStateAction<Partial<TUser>>>) =>
		(event: React.ChangeEvent<HTMLInputElement>) => {
			setter((prev) => ({
				...prev,
				[event.target.name]: event.target.value,
			}));
		};

	//Mutation for login
	const signInMutation = useMutation<TSignInResponse, TError, Partial<TUser>>({
		mutationFn: AuthService.signIn,
		onSuccess: handleSignInSuccess,
		onError: handleSignInError,
	});

	const handleSignIn = () => {
		if (!userData?.email || !userData?.password) {
			toast.error("Please fill required field.");
		} else {
			signInMutation.mutate(userData);
		}
	};

	function handleSignInSuccess(data: TSignInResponse) {
		if (data) {
			const { access, _id } = data.user;

			setAccess(access, _id);
			localStorage.setItem("token", data.token);

			if (checkAccessList(access, dashboardAccessList)) {
				navigate("/dashboard")
			} else if (checkAccessList(access, productAccessList)) {
				navigate("/products");
			} else if (checkAccessList(access, orderAccessList)) {
				navigate("/orders");
			} else if (checkAccessList(access, userAccessList)) {
				navigate("/users");
			} else {
				toast.error("No valid permissions found.");
			}

			setUserData({ email: "", password: "" });
			toast.success("Login successful.");
		}
	}

	function handleSignInError(error: TError) {
		handleApiError(error, "Failed to sign in. please try again.");
	}

	return {
		showPassword,
		userData,
		signInMutation,
		setShowPassword,
		handleChange,
		handleSignIn,
		setUserData,
	};
};
export default useLogin;
