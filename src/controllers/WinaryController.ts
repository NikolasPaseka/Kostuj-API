import { Request, Response } from "express";
import { IWinary } from "../models/Winary";
import { WinaryRepository } from "../repositories/WinaryRepository";

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
}