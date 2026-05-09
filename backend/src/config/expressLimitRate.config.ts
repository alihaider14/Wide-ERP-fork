import rateLimit from "express-rate-limit";

export const forgotPasswordlimiter = rateLimit({
	windowMs: 5 * 60 * 1000, // 5 minutes
	limit: 1, // Limit each IP to 1 requests per `window` (here, per 5 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
	ipv6Subnet: 56, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive
	message: {
		error:
			"Too many password reset attempts. Please try again after 5 minutes.",
	},
});
export const signInlimiter = rateLimit({
	windowMs: 60 * 60 * 1000, // 1 hour
	limit: 5,
	standardHeaders: true,
	legacyHeaders: false,
	ipv6Subnet: 56,
	message: {
		error: "Too many sign in attempts. Please try again after an hour.",
	},
});
