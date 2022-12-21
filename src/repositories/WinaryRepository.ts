import { Winary } from "../models/winary";

export class WinaryRepository {

    async getWinaries() {
        return await Winary.find({});
    }
}