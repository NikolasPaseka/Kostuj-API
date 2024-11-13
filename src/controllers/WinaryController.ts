import { Request, Response } from "express";
import { IWinary } from "../models/Winary";
import { WinaryRepository } from "../repositories/WinaryRepository";
import { TokenRequest } from "../middleware/auth";
import { ObjectId } from "mongoose";
import { ResponseError } from "../utils/ResponseError";
import { handleDeleteImage, handleImageUpload } from "../utils/handleImageUpload";
import { WineRepository } from "../repositories/WineRepository";

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

    createWinery = async (req: TokenRequest, res: Response) => {
        const winary: IWinary = req.body;
        const newWinery = await this.winaryRepository.createWinary(winary);
        res.json(newWinery);
    }

    deleteWinery = async (req: TokenRequest, res: Response) => {
        const winery = req.body;
        const result = await this.winaryRepository.deleteWinary(winery.id);
        res.json(result);
    }

    updateWinery = async (req: TokenRequest, res: Response) => {
        const winery: IWinary = req.body;
        if (winery.id == null) { throw new ResponseError("Winery id is required", 400); }
        const updatedWinery = await this.winaryRepository.updateWinary(winery.id, winery);
        res.json(updatedWinery);
    }

    importWineries = async (req: TokenRequest, res: Response) => {
        const wineries: IWinary[] = req.body;
        const adminId: ObjectId = req.token._id;

        const newWineries = await this.winaryRepository.importWinaries(wineries, adminId);
        res.json(newWineries);
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