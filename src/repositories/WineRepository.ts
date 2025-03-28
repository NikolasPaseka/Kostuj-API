import mongoose from "mongoose";
import { GrapeVarietal } from "../models/GrapeVarietal";
import { ISample, Sample } from "../models/Sample";
import { Winary } from "../models/Winary";
import { IWine, Wine, WineUtil } from "../models/Wine";

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

    getWinesByWineries = async (wineryIds: string[]) => {
        return await Wine.find({ winaryId: { $in: wineryIds } });
    }

    async getGrapeVarietals() {
        return await GrapeVarietal.find({});
    }

    getGrapeVariatelByName = async (name: string) => {
        return await GrapeVarietal.findOne({ grape: name });
    }

    // Admins part
    createWineSample = async (wineSample: ISample, wine: IWine, wineryId: string) => {
        const createdWine = await this.createWine(wine, wineryId);
        wineSample.wineId = createdWine._id
        return await new Sample(wineSample).save()
    }

    createWine = async (wine: IWine, wineryId: string): Promise<IWine> => {
        // When creating firstly check if the wine is already created
        const wineryWines = await this.getWinesByWinery(wineryId);
        const existedWine = WineUtil.checkWineExists(wineryWines, wine, wineryId);

        if (existedWine) {
            return existedWine;
        }

        const grapeId = (await this.getGrapeVariatelByName(wine.name))?._id
        if (grapeId) {
            wine.grapeVarietals = [grapeId];
        }

        return await new Wine(wine).save()
    }

    updateWineSamples = async (wineSamples: ISample[]) => {
        const bulkOps = wineSamples.map(sample => ({
            updateOne: {
                filter: { _id: new mongoose.Types.ObjectId(sample.id) },
                update: { $set: { rating: sample.rating, name: sample.name , note: sample.note, ratingCommission: sample.ratingCommission} }
            }
        }));
        return await Sample.bulkWrite(bulkOps);
    }

    updateWineSampleRating = async (sampleId: string, rating: number) => {
        return await Sample.updateOne({ _id: sampleId }, { rating });
    }
}