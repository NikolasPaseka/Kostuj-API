import { Request, Response } from "express";
import { Document } from "mongoose";
import { ICatalogue } from "../models/catalogue";
import { IWinary } from "../models/winary";
import { CatalogueRepository } from "../repositories/CatalogueRepository";
import { WinaryRepository } from "../repositories/WinaryRepository";

export class MapLocationController {
    private catalogueRepository = new CatalogueRepository();
    private winaryRepository = new WinaryRepository();

    private getLocationWithTypes = (locations: Document[], locationType: string) => {
        const locationObjects:  {[k: string]: any}[] = [];

        for (const location of locations) {
            const object = location.toObject({ getters: true });
            object["locationType"] = locationType;
            if (object["title"] != null) {
                object["name"] = object["title"];
                delete object["title"];
            }
            delete object["_id"];
            delete object["__v"];

            locationObjects.push(object);
        }
        return locationObjects;
    }

    getAllLocations = async (req: Request, res: Response) => {
        const catalogues = await this.catalogueRepository.getCatalogues();
        const winaries = await this.winaryRepository.getWinaries();

        const resultArray = [...this.getLocationWithTypes(catalogues, "feast"), ...this.getLocationWithTypes(winaries, "winery")];
        res.json(resultArray);
    }

}