import { Request, Response } from "express";
import { IWinary, Winary } from "../models/winary";
import { WinaryRepository } from "../repositories/WinaryRepository";
export class WinaryController {
    private winaryRepository = new WinaryRepository();

    getWinaries = async (req: Request, res: Response) => {
        const winaries: IWinary[] = await this.winaryRepository.getWinaries();

        res.json(winaries);
    }
}