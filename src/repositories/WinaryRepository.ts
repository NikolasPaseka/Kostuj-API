import { IWinary, Winary, WineryDomain, WineryUtil } from "../models/Winary";
import { ResponseError } from "../utils/ResponseError";
import { ObjectId } from "mongoose";
import { WineRepository } from "./WineRepository";
import { Sample } from "../models/Sample";
import { Wine } from "../models/Wine";

export class WinaryRepository {
    private wineRepository = new WineRepository();

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

    //Admins part
    async getWineriesByAdmin(adminId: ObjectId) {
        return Winary.find({ adminId: adminId });
    }

    async createWinary(winery: WineryDomain) {
        if (WineryUtil.checkWineryExists(await this.getWinaries(), winery, winery.adminId?.toString() ?? "") != null) {
            throw new ResponseError("Winery already exists", 400);
        };
        return await new Winary(winery).save();
    }

    async deleteWinary(wineryId: string): Promise<{ numOfDeletedSamples: number, numOfDeletedWines: number }> {
        const wineryWines = await this.wineRepository.getWinesByWinery(wineryId);

        // Delete all samples associated with these wines
        const numOfDeletedSamples = (await Sample.deleteMany({ wineId: { $in: wineryWines.map(w => w._id) } })).deletedCount;
        // Delete all wines associated with this winery
        const numOfDeletedWines = (await Wine.deleteMany({ winaryId: wineryId })).deletedCount;

        await Winary.deleteOne({ _id: wineryId });
        return { numOfDeletedSamples, numOfDeletedWines };
    }

    async updateWinary(wineryId: string, winery: IWinary) {
        return await Winary.findOneAndUpdate({ _id: wineryId }, winery, { new: true });
    }

    async importWinaries(wineries: IWinary[], adminId: ObjectId) {
        const existingWinaries = await this.getWinaries();
        console.log(wineries)
        const newWinaries = wineries.filter(winery => WineryUtil.checkWineryExists(existingWinaries, winery, adminId.toString()) == null);
        return await Winary.insertMany(newWinaries);
    }
    
    async deleteWineries(wineryId: string[]) {
        return await Winary.deleteMany({ _id: { $in: wineryId } });
    }
    
    async updateImage(wineryId: string, imageUrl: string) {
        return await Winary.updateOne({ _id: wineryId}, { imageUrl: imageUrl });
    }

    async deleteWineryImage(wineryId: string) {
        return await Winary.updateOne({ _id: wineryId }, { imageUrl: null });
    }
}