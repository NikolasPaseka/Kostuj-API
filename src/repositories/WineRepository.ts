import { GrapeVarietal } from "../models/GrapeVarietal";
import { Winary } from "../models/winary";
import { Wine } from "../models/wine";

export class WineRepository {

    async getWines() {
        return await Wine.find({});
    }

    async getWineDetail(id: string) {
        return await Wine.findById(id).populate([{
            path: "winaryId",
            model: Winary
        }, {
            path: "grapeVarietals",
            model: GrapeVarietal
        }]);
    }

    async getGrapeVarietals() {
        return await GrapeVarietal.find({});
    }
}