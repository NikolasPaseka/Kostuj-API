import { Request, Response } from "express";
import { IWinary } from "../models/Winary";
import { WinaryRepository } from "../repositories/WinaryRepository";
import { TokenRequest } from "../middleware/auth";
import { ObjectId } from "mongoose";
import { ResponseError } from "../utils/ResponseError";
import { handleDeleteImage, handleImageUpload } from "../utils/handleImageUpload";

export class WinaryController {
    private winaryRepository = new WinaryRepository();

    getWinaries = async (req: Request, res: Response) => {
        const winaries: IWinary[] = await this.winaryRepository.getWinaries();

        res.json(winaries);
    }

    getWineryDetail = async (req: Request, res: Response) => {
        const { id } = req.params;
        const winery = await this.winaryRepository.getWineryDetail(id);

        res.json(winery);
    }

    // Admins part
    getWineriesByAdmin = async (req: TokenRequest, res: Response) => {
        const adminId: ObjectId = req.token._id;

        const adminCatalogues = await this.winaryRepository.getWineriesByAdmin(adminId);
        res.json(adminCatalogues);
    }

    uploadWineryImage = async (req: TokenRequest, res: Response) => {
        const wineryId = req.params.id;
        const image = req.file as Express.Multer.File;

        if (image == null) { throw new ResponseError("No image provided", 400); }

        const winery = await this.winaryRepository.getWineryDetail(wineryId);
        if (winery == null) { throw new ResponseError("Winery not found", 404); }

        const imageUrl = await handleImageUpload(
            winery.id,
            "kostuj_wineries",
            image
        );

        this.winaryRepository.updateImage(wineryId, imageUrl);
        res.json(imageUrl);
    }

    deleteWineryImage = async (req: TokenRequest, res: Response) => {
        const { id } = req.params;
        const imageUrl: string = req.body.imageUrl;
        
        await this.winaryRepository.deleteWineryImage(id);
        await handleDeleteImage(imageUrl, "kostuj_wineries");
        
        res.json({ "message": "Image deleted" });
    }
}