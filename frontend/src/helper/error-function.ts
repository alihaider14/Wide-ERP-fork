import { TError } from "@/types/TError";
import toast from "react-hot-toast";

export const handleApiError = (error: TError, fallbackMessage: string) => {
	const errorData = error?.response?.data?.error;

	console.log({ error: `handleApiError ${error}` });

	let errorMessage: string;
	if (typeof errorData === "string") {
		errorMessage = errorData;
	} else if (typeof errorData === "object" && errorData !== null) {
		errorMessage = Object.entries(errorData)
			.map(([, value]) => `${value}`)
			.join("\n");
	} else {
		errorMessage = error?.message || fallbackMessage;
	}

	toast.error(errorMessage || "Oops! Something went wrong. Please try again.");
};
