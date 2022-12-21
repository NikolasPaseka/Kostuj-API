import { Request, Response } from "express";
import { TokenRequest } from "../middleware/auth";
import { Catalogue } from "../models/catalogue";
import { FollowedCatalogue } from "../models/followedCatalogues";
import { Sample } from "../models/sample";
import { IWine, Wine } from "../models/wine";

import { CatalogueRepository } from "../repositories/CatalogueRepository";
import { ResponseError } from "../utils/ResponseError";

export class CatalogueController {

    private catalogueRepository = new CatalogueRepository();

    getCatalogues = async (req: Request, res: Response) => {
        const catalogues = await this.catalogueRepository.getCatalogues();

        res.json(catalogues);
    }

    getCatalogueDetail = async (req: Request, res: Response) => {
        const { id } = req.params;
        const catalogue = await this.catalogueRepository.getCatalogueDetail(id);

        res.json(catalogue);
    }

    getCatalogueSamples = async (req: Request, res: Response) => {
        const { id } = req.params;
        const samples = await this.catalogueRepository.getCatalogueSamples(id);

        res.json(samples)
    }

    getSampleCountsByColor = async (req: Request, res: Response) => {
        const { id } = req.params;
        const samples = await this.catalogueRepository.getCatalogueSamples(id);
        
        let countsMap = new Map<string, number>([
            ["red", 0],
            ["white", 0],
            ["rose", 0]
        ]);

        for (const sample of samples) {
            if (sample.wineId instanceof Wine) {
                const color = sample.wineId.color;
                countsMap.set(color, (countsMap.get(color) ?? 0) + 1);
            }
        }
        const countsObject = Object.fromEntries(countsMap);

        res.json(countsObject);
    }

    changeUserFollowState = async (req: TokenRequest, res: Response) => {
        const catalogueId = req.params.id;
        const follow: boolean = req.body.follow;
        const userId = req.token._id.toString();

        const result = await this.catalogueRepository.getFollowedCatalogue(catalogueId, userId)

        if (follow && !result) {
            this.catalogueRepository.followCatalogue(catalogueId, userId);
            return res.send("followed");
        }
        else if (!follow && result) {
            this.catalogueRepository.unfollowCatalogue(result.id);
            return res.send("unfollowed");
        } else {
            throw new ResponseError("Error occured while performing follow catalogue request");
        }
    }
}