import mongoose from "mongoose";
import { GrapeVarietal } from "../models/GrapeVarietal";
import { ISample, Sample } from "../models/Sample";
import { Winary } from "../models/Winary";
import { IWine, Wine } from "../models/Wine";

export class WineRepository {
    private checkExistedWine = (wine: IWine, wineList: IWine[]): IWine | null => {
        return wineList.find(w => w.name === wine.name && w.year === wine.year) ?? null;
    }

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
    createWineSample = async (wineSample: ISample, wine: IWine, wineryId: string) => {
        // When creating wine sample, firstly check if the wine is already created
        const wineryWines = await this.getWinesByWinery(wineryId);
        const existedWine = this.checkExistedWine(wine, wineryWines);

        if (existedWine) {
            wineSample.wineId = existedWine._id;
        } else {
            const createdWine = await this.createWine(wine);
            wineSample.wineId = createdWine.id;
        }

        return await new Sample(wineSample).save()
    }

    createWine = async (wine: IWine) => {
        return await new Wine(wine).save()
    }

    updateWineSamples = async (wineSamples: ISample[]) => {
        const bulkOps = wineSamples.map(sample => ({
            updateOne: {
                filter: { _id: new mongoose.Types.ObjectId(sample.id) },
                update: { $set: { rating: sample.rating, name: sample.name } }
            }
        }));
        return await Sample.bulkWrite(bulkOps);
    }
}