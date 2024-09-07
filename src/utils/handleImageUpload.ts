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

/**
 * Handles the upload of multiple image files and returns an array of secure URLs (strings) of the uploaded images.
 * @param imageName - The base name for the images to be uploaded.
 * @param folder - The folder where the images will be uploaded.
 * @param images - An array of image files to be uploaded.
 * @returns A Promise that resolves to an array of secure URLs (strings) of the uploaded images.
 */
export const handleImagesUpload = async (
    imageName: string,
    imageNumber: number,
    folder: string,
    images: Express.Multer.File[]
): Promise<string[]> => {
    const uploadPromises = images.map((image, index) => {
        const options = {
            public_id: `${imageName}_${imageNumber + index}`,
            use_filename: false,
            unique_filename: true,
            overwrite: true,
            folder: folder
        };

        const b64 = Buffer.from(image.buffer).toString("base64");
        const dataURI = "data:" + image.mimetype + ";base64," + b64;

        return cloudinary.uploader.upload(dataURI, options);
    });

    const results = await Promise.all(uploadPromises);
    return results.map(result => result.secure_url);
}

export const handleDeleteImage = async (imageUrl: string, folder: string) => {
    //const regex = new RegExp("https://res.cloudinary.com/[^/]+/[^/]+/[^/]+/[^/]+");
    const imageUrlSplitted = imageUrl.split("/");
    const imageName = imageUrlSplitted[imageUrlSplitted.length - 1].split(".")[0];

    //https://res.cloudinary.com/passy/image/upload/v1725644372/kostuj_catalogues/655b4d7284375ca089a99e71_6.png

    await cloudinary.uploader.destroy(`${folder}/${imageName}`);
}