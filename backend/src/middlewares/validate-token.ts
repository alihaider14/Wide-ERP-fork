import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { TAuthenticatedRequest } from "~/types/express";
import { ERROR_MESSAGES } from "~/constants/errorMessages";
import { JWT_SECRET } from "~/config/jwt.config";
import User from "~/models/user";

const authenticateJWT = (accessKey?: string) => {
	return async (
		req: TAuthenticatedRequest,
		res: Response,
		next: NextFunction,
	): Promise<void> => {
		try {
			const bearerToken = req.headers["authorization"];

			if (!bearerToken) {
				res.status(401).json({ error: ERROR_MESSAGES.unauthorized });
				return;
			}

			const token = bearerToken?.split("Bearer ")[1];

			jwt.verify(
				token!,
				JWT_SECRET,
				async (err, decoded: string | jwt.JwtPayload | undefined) => {
					if (err) {
						res.status(401).json({ error: ERROR_MESSAGES.unauthorized });
						return;
					}

					if (!decoded || typeof decoded !== "object" || !("user" in decoded)) {
						res.status(401).json({ error: ERROR_MESSAGES.unauthorized });
						return;
					}

					const payload = decoded as { user?: TAuthenticatedRequest["user"] };

					if (!payload.user?._id) {
						res.status(401).json({ error: ERROR_MESSAGES.unauthorized });
						return;
					}

					if (accessKey) {
						const user = await User.findById(payload.user._id);
						if (!user || !user.access.includes(accessKey)) {
							res.status(403).json({ error: ERROR_MESSAGES?.permissionDenied });
							return;
						}
					}

					req.user = payload.user;

					next();
				},
			);
		} catch (error) {
			res.status(500).json({ error: ERROR_MESSAGES.serverError });
		}
	};
};

export default authenticateJWT;
