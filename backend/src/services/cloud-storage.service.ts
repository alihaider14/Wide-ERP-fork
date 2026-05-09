import { Storage } from "@google-cloud/storage";
import { config } from "dotenv";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import sharp from "sharp";
config();

const credentials = {
	type: process.env.GCS_TYPE,
	project_id: process.env.GCS_PROJECT_ID,
	private_key_id: process.env.GCS_PRIVATE_KEY_ID,
	private_key: process.env.GCS_PRIVATE_KEY?.replace(/\\n/g, "\n"),
	client_email: process.env.GCS_CLIENT_EMAIL,
	client_id: process.env.GCS_CLIENT_ID,
	auth_uri: process.env.GCS_AUTH_URI,
	token_uri: process.env.GCS_TOKEN_URI,
	auth_provider_x509_cert_url: process.env.GCS_AUTH_PROVIDER_X509_CERT_URL,
	client_x509_cert_url: process.env.GCS_CLIENT_X509_CERT_URL,
	universe_domain: process.env.GCS_UNIVERSE_DOMAIN,
};

const storage = new Storage({
	projectId: process.env.GCS_PROJECT_ID,
	credentials,
});

const bucketName = process.env.GCS_BUCKET_NAME || "wide-erp-bucket";
const MAX_DIMENSION = 500;
const bucket = storage.bucket(bucketName);

export const uploadImageToGCS = ({
	file,
	folder = "product-images",
}: {
	file: Express.Multer.File;
	folder: string;
}): Promise<string> => {
	return new Promise(async (resolve, reject) => {
		try {
			const fileExtension = path.extname(file.originalname) || ".jpg";
			const buffer = await resizeImageWithSharp(file.buffer, file.mimetype);

			const fileName = `${uuidv4()}${fileExtension}`;
			const gcsPath = `${folder}/${fileName}`;

			const blob = bucket.file(gcsPath);

			const blobStream = blob.createWriteStream({
				resumable: false,
				contentType: file.mimetype,
				metadata: {
					cacheControl: "public, max-age=31536000",
				},
			});

			blobStream.on("error", (err) => {
				reject(new Error(`GCS upload failed: ${err.message}`));
			});

			blobStream.on("finish", () => {
				const publicUrl = `https://storage.googleapis.com/${bucketName}/${gcsPath}`;

				resolve(publicUrl);
			});

			blobStream.end(buffer);
		} catch (err) {
			reject(
				new Error(`Upload Image processing failed: ${(err as Error).message}`),
			);
		}
	});
};

export const deleteImageFromGCS = async (publicUrl: string) => {
	const prefix = `https://storage.googleapis.com/${bucketName}/`;

	if (!publicUrl.startsWith(prefix)) {
		throw new Error(`URL is not a valid GCS URL for bucket "${bucketName}"`);
	}

	const gcsPath = publicUrl.replace(prefix, "");

	await bucket.file(gcsPath).delete({ ignoreNotFound: true });
};

export const resizeImageWithSharp = async (
	buffer: Buffer,
	mimetype: string,
) => {
	const image = sharp(buffer);
	const metadata = await image.metadata();

	const { width = 0, height = 0 } = metadata;
	const needsResize = width > MAX_DIMENSION || height > MAX_DIMENSION;

	if (!needsResize) {
		return buffer;
	}

	const format =
		mimetype === "image/png"
			? "png"
			: mimetype === "image/webp"
				? "webp"
				: "jpeg";

	const resizedBuffer = await image
		.resize({
			width: MAX_DIMENSION,
			height: MAX_DIMENSION,
			fit: "contain",
		})
		.toFormat(format)
		.toBuffer();

	return resizedBuffer;
};
