import { Catalogue } from "../models/Catalogue";
import { IMapData, MapData } from "../models/MapData";

export class MapDataRepository {

    getMapData = async (catalogueId: string): Promise<IMapData | null> => {
        const mapData = await MapData.findOne({ catalogueId: catalogueId });
        return mapData;
    }

    createMapData = async (mapData: IMapData): Promise<IMapData> => {
        const newMapData = new MapData(mapData);
        const savedMapData = await newMapData.save();
        console.log(mapData.catalogueId);
        await Catalogue.updateOne({ _id: mapData.catalogueId }, { mapData: savedMapData._id });
        return savedMapData;
    }

    updateMapData = async (catalogueId: string, mapData: IMapData) => {
        await MapData.updateOne({ catalogueId: catalogueId }, mapData);
    }
}