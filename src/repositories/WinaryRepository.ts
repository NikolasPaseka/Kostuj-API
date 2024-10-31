import { Winary, WineryDomain } from "../models/Winary";
import { ResponseError } from "../utils/ResponseError";
import { ObjectId } from "mongoose";

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

    //Admins part
    async getCataloguesByAdmin(adminId: ObjectId) {
        return Winary.find({ adminId: adminId });
    }

    async createWinary(winery: WineryDomain) {
        return await new Winary(winery).save();
    }

    async deleteWinary(wineryId: string) {
        return await Winary.deleteOne({ _id: wineryId });
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