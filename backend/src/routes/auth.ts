import { Router } from "express";
import { signup } from "~/controllers/auth/signup";
import { signin } from "~/controllers/auth/signin";
import { forgotPassword } from "~/controllers/auth/forgotPassword";
import { resetPassword } from "~/controllers/auth/resetPassword";
import {
	forgotPasswordlimiter,
	signInlimiter,
} from "~/config/expressLimitRate.config";

export default (router: Router) => {
	router.post("/sign-up", signup);
	router.post("/sign-in", signInlimiter, signin);
	router.post("/forgot-password", forgotPasswordlimiter, forgotPassword);
	router.post("/reset-password", resetPassword);
};
