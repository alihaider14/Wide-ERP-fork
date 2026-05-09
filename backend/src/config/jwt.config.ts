import "dotenv/config";

const jwtSecret = process.env.JWT_SECRET;
const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;

if (!jwtSecret) {
	throw new Error("Invalid JWT_SECRET: set JWT_SECRET in environment.");
}

if (!jwtRefreshSecret) {
	throw new Error(
		"Invalid JWT_REFRESH_SECRET: set JWT_REFRESH_SECRET in environment.",
	);
}

export const JWT_SECRET = jwtSecret;
export const JWT_REFRESH_SECRET = jwtRefreshSecret;