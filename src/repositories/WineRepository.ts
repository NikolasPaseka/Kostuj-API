import { GrapeVarietal } from "../models/GrapeVarietal";
import { ISample, Sample } from "../models/Sample";
import { Winary } from "../models/Winary";
import { IWine, Wine } from "../models/Wine";

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

    getSampleDetail = async (id: string) => {
        return Sample.findById(id)
        .populate({ 
            path: "wineId", 
            model: Wine,
            populate: [{
                path: "winaryId",
                model: Winary
            }, {
                path: "grapeVarietals",
                model: GrapeVarietal
            }]
        });
    }

    getWinesByWinery = async (id: string) => {
        return await Wine.find({ winaryId: id });
    }

    async getGrapeVarietals() {
        return await GrapeVarietal.find({});
    }

    // Admins part
    createWineSample = async (wineSample: ISample) => {
        return await new Sample(wineSample).save()
    }

    createWine = async (wine: IWine) => {
        return await new Wine(wine).save()
    }
}