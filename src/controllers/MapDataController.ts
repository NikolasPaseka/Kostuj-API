import { Request, Response } from "express";
import { IMapData } from "../models/MapData";
import { MapDataRepository } from "../repositories/MapDataRepository";

export class MapDataController {
    private mapDataRepository = new MapDataRepository();


    getCatalogueMapData = async (req: Request, res: Response) => {
        const catalogueId = req.params.id;
        const mapData = await this.mapDataRepository.getMapData(catalogueId);
        return res.json(mapData);
    }

    createCatalogueMapData = async (req: Request, res: Response) => {
        const newMapData = req.body as IMapData;
        const oldMapData = await this.mapDataRepository.getMapData(newMapData.catalogueId.toString());
        if (oldMapData) {
            await this.mapDataRepository.updateMapData(newMapData.catalogueId.toString(), newMapData);
        } else {
            const created = await this.mapDataRepository.createMapData(newMapData);
        }
        return res.json({ message: "Map data created" });
    }
}