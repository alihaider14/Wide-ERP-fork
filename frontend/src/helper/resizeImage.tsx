import imageCompression from "browser-image-compression";

const MAX_DIMENSION = 500;

export const resizeImageWithImageCompression = async (
	file: File,
): Promise<File> => {
	return await imageCompression(file, {
		maxWidthOrHeight: MAX_DIMENSION,
	});
};
