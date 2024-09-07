import multer from "multer";
const storage = multer.memoryStorage();

export const multerUpload = multer({ storage: storage }).single("avatar");

export const getMulterUpload = (storageName: string, multipleImages: boolean = false) => { 
    if (multipleImages) {
        return multer({ storage: storage }).array(storageName);
    } else {
        return multer({ storage: storage }).single(storageName);
    }
}
