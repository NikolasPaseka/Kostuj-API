import {v2 as cloudinary} from "cloudinary";

/**
 * Handles the upload of an image file and returns the secure URL (string) of the uploaded image.
 * @param image - The image file to be uploaded.
 * @returns A Promise that resolves to the secure URL (string) of the uploaded image.
 */
export const handleImageUpload = async (
    imageName: string,
    folder: string,
    image: Express.Multer.File
): Promise<string> => {
    const options = {
        public_id: imageName,
        use_filename: false,
        unique_filename: true,
        overwrite: true,
        folder: folder
    };

    const b64 = Buffer.from(image.buffer).toString("base64");
    const dataURI = "data:" + image.mimetype + ";base64," + b64;
    const result = await cloudinary.uploader.upload(dataURI, options);

    return result.secure_url;
}