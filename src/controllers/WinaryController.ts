import { Request, Response } from "express";
import { IWinary } from "../models/Winary";
import { WinaryRepository } from "../repositories/WinaryRepository";
import { TokenRequest } from "../middleware/auth";
import { ObjectId } from "mongoose";

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

        const adminCatalogues = await this.winaryRepository.getCataloguesByAdmin(adminId);
        res.json(adminCatalogues);
    }
}