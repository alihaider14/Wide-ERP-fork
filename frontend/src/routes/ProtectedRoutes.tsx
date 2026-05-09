import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { JwtPayload } from "@/types/access";

const ProtectedRoutes = () => {
	const token = localStorage.getItem("token");
	let isAuthenticated = false;
	if (token) {
		try {
			const decoded = jwtDecode<JwtPayload>(token);
			if (decoded && decoded.exp && decoded.exp * 1000 > Date.now()) {
				isAuthenticated = true;
			}
		} catch {
			isAuthenticated = false;
		}
	}

	return isAuthenticated ? <Outlet /> : <Navigate to='/login' replace /> ;
};

export default ProtectedRoutes;
