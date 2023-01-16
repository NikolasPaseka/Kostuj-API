import { Request, Response } from "express";
import { IGrapeVarietal } from "../models/GrapeVarietal";
import { IWine } from "../models/wine";
import { WineRepository } from "../repositories/WineRepository";
import { ResponseError } from "../utils/ResponseError";

export class WineController {
    private wineRepository = new WineRepository();

    getWines = async (req: Request, res: Response) => {
        const wines: IWine[] = await this.wineRepository.getWines();

        res.json(wines);
    }

    getWineDetail = async (req: Request, res: Response) => {
        const { id } = req.params;
        const wine = await this.wineRepository.getWineDetail(id);
        if (wine == null) {
            throw new ResponseError("Wine does not found", 404);
        }

        res.json(wine);
    }

    getGrapeVarietals = async (req: Request, res: Response) => {
        const grapeVarietals: IGrapeVarietal[] = await this.wineRepository.getGrapeVarietals();

        res.json(grapeVarietals);
    }
}