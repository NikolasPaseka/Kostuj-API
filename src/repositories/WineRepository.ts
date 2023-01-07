import { GrapeVarietal } from "../models/GrapeVarietal";
import { Wine } from "../models/wine";

export class WineRepository {

    async getWines() {
        return await Wine.find({});
    }

    async getGrapeVarietals() {
        return await GrapeVarietal.find({});
    }
}