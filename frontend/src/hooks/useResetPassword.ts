
import { handleApiError } from "@/helper/error-function";
import { AuthService } from "@/services";
import { TError } from "@/types/TError";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import { TResetPassword, TUser } from "@/types/User";
import { useNavigate } from "react-router-dom";

const useResetPassword = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState<Partial<TResetPassword>>({
        token: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [showPassword, setShowPassword] = useState(false);

    const handleChange =
        (setter: React.Dispatch<React.SetStateAction<Partial<TResetPassword>>>) =>
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setter((prev) => ({
                ...prev,
                [event.target.name]: event.target.value,
            }));
        };

    const resetPasswordMutation = useMutation(({
        mutationFn: AuthService.resetPassword,
        onSuccess: handleResetPasswordSuccess,
        onError: handleResetPasswordError,
    }));

    const handleResetPassword = () => {
        if (!userData?.confirmPassword || !userData?.newPassword) {
            toast.error("Please fill required field.");
        } else {
            resetPasswordMutation.mutate(userData);
        }
    };

    function handleResetPasswordSuccess(data: TUser) {
        if (data) {
            setUserData({ confirmPassword: "", newPassword: "", token: "" });
            navigate("/login");
            toast.success("Password reset successfull.");
        }
    }

    function handleResetPasswordError(error: TError) {
        handleApiError(error, "Failed to reset password. please try again.");
    }

    return {
        userData,
        resetPasswordMutation,
        handleChange,
        handleResetPassword,
        setUserData,
        setShowPassword,
        showPassword
    };
};
export default useResetPassword;
