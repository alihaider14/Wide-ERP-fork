import "dotenv/config";

const rawEncryptionKey = process.env.ENCRYPTION_KEY;

if (!rawEncryptionKey || Buffer.byteLength(rawEncryptionKey, "utf8") < 32) {
	throw new Error(
		"Invalid ENCRYPTION_KEY: set ENCRYPTION_KEY in environment with at least 32 bytes.",
	);
}

export const ENCRYPTION_KEY = Buffer.from(rawEncryptionKey, "utf8").subarray(
	0,
	32,
);
export const ENCRYPTION_ALGORITHM = "aes-256-cbc";