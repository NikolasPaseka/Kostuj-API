import { Request, Response } from "express";
import { IGrapeVarietal } from "../models/GrapeVarietal";
import { IWine } from "../models/Wine";
import { WineRepository } from "../repositories/WineRepository";
import { ResponseError } from "../utils/ResponseError";
import { ISample } from "../models/Sample";
import { parseBoolean } from "../utils/parseBoolean";
import { ResultSweetnessOptions } from "../models/utils/ResultSweetnessOptions";

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

    getWinesByWinery = async (req: Request, res: Response) => {
        const { id } = req.params;
        const wines = await this.wineRepository.getWinesByWinery(id);

        res.json(wines);
    }

    getGrapeVarietals = async (req: Request, res: Response) => {
        const grapeVarietals: IGrapeVarietal[] = await this.wineRepository.getGrapeVarietals();

        res.json(grapeVarietals);
    }

    // Admins part
    createWineSample = async (req: Request, res: Response) => {
        const { sample, wine, selectedWineryId }: { sample: ISample; wine: IWine; selectedWineryId: string } = req.body;
        
        if (wine.resultSweetness && !Object.values(ResultSweetnessOptions).includes(wine.resultSweetness as ResultSweetnessOptions)) {
            wine.resultSweetness = undefined;
        }
        const newWineSample = await this.wineRepository.createWineSample(sample, wine, selectedWineryId);
        const responseData = await this.wineRepository.getSampleDetail(newWineSample.id);

        res.json(responseData);
    }

    updateWineSamples = async (req: Request, res: Response) => {
        const samples: ISample[] = req.body;
        const updatResult = await this.wineRepository.updateWineSamples(samples);

        res.json({ message: "Samples updated" });
    }
}