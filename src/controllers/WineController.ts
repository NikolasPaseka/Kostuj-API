import { Request, Response } from "express";
import { IGrapeVarietal } from "../models/GrapeVarietal";
import { IWine } from "../models/Wine";
import { WineRepository } from "../repositories/WineRepository";
import { ResponseError } from "../utils/ResponseError";
import { ISample } from "../models/Sample";
import { parseBoolean } from "../utils/parseBoolean";

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
        const createWine = parseBoolean(req.query.createWine as string);
        let wineSample: ISample;
        let wine: IWine;
        if (createWine) {
            console.log("Creating also wine");
            wine = req.body.wine;
            wineSample = req.body.sample;
            const createdWine = await this.wineRepository.createWine(wine);
            wineSample.wineId = createdWine.id
            console.log(wineSample)
        } else {
            console.log("Creating only sample");
            console.log(req.body)
            wineSample = req.body;
        }
        wineSample = await this.wineRepository.createWineSample(wineSample);

        const newWineSample = await this.wineRepository.createWineSample(wineSample);
        const responseData = await this.wineRepository.getSampleDetail(newWineSample.id);

        res.json(responseData);
    }
}