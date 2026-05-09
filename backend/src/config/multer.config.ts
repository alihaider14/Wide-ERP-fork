import multer, { memoryStorage } from "multer";
import {
	ALLOWED_MIME_TYPES,
	MAX_UPLOAD_FILE_SIZE_BYTES,
} from "~/constants/upload";

export const multerMiddleWare = multer({
	storage: memoryStorage(),
	limits: {
		fileSize: MAX_UPLOAD_FILE_SIZE_BYTES,
	},
	fileFilter: (_req, file, cb) => {
		if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
			cb(null, true);
		} else {
			cb(
				new Error(
					`Invalid file type. Allowed: ${ALLOWED_MIME_TYPES.join(", ")}`,
				),
			);
		}
	},
});
