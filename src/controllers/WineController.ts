import { Request, Response } from "express";
import { IGrapeVarietal } from "../models/GrapeVarietal";
import { IWine } from "../models/wine";
import { WineRepository } from "../repositories/WineRepository";

export class WineController {
    private wineRepository = new WineRepository();

    getWines = async (req: Request, res: Response) => {
        const wines: IWine[] = await this.wineRepository.getWines();

        res.json(wines);
    }

    getGrapeVarietals = async (req: Request, res: Response) => {
        const grapeVarietals: IGrapeVarietal[] = await this.wineRepository.getGrapeVarietals();

        res.json(grapeVarietals);
    }
}