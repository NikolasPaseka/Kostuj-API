import { Winary } from "../models/Winary";
import { ResponseError } from "../utils/ResponseError";

export class WinaryRepository {

    async getWinaries() {
        return await Winary.find({});
    }

    async getWineryDetail(wineryId: string) {
        const winery = await Winary.findById(wineryId);
        if (winery == null) {
            throw new ResponseError("Catalogue not found", 404);
        }
        return winery;
    }
}