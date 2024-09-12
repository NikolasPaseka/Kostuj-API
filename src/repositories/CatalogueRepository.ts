import { ObjectId } from "mongoose";
import { Catalogue, ICatalogue } from "../models/Catalogue";
import { GrapeVarietal } from "../models/GrapeVarietal";
import { Sample } from "../models/Sample";
import { IWinary, Winary } from "../models/Winary";
import { IWine, Wine } from "../models/Wine";
import { ResponseError } from "../utils/ResponseError";


export class CatalogueRepository {
    private onlyUnique(value: any, index: any, self: any) {
        return self.indexOf(value) === index;
      }
    
    getAllCatalogues = async () => {
        return Catalogue.find();
    }

    getCatalogues = async (page: number, limit: number) => {
        const startIndex = (page - 1) * limit;
        return await Catalogue.find().limit(limit).skip(startIndex).exec();
    }

    getCatalogueByTitle = async (title: string) => {
        return Catalogue.find({ title: { $regex: title, $options: "i" }});
    }

    async getCatalogueDetail(catalogueId: string) {
        const catalogue = await Catalogue.findById(catalogueId);
        if (catalogue == null) {
            throw new ResponseError("Catalogue not found", 404);
        }
        return catalogue;
    }

    async getCatalogueSamples(catalogueId: string) {
        return Sample.find({
            catalogueId: catalogueId
        })
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

    async getCatalogueSampleDetail(id: string) {
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

    async getParticipatedWineries(catalogueId: string) {
        // TODO CHANGE na particepated wineries entries
        const samplesResult =  await Sample.find({ catalogueId: catalogueId });
        const wineIds: string[] = [];
        samplesResult.map(x => { wineIds.push(x.wineId?.toString() ?? "") });

        const wineResults = await Wine.find().where("_id").in(wineIds);
        let wineriesIds: string[] = [];
        wineResults.map(x => { wineriesIds.push(x.winaryId.toString()) });

        wineriesIds = wineriesIds.filter(this.onlyUnique);
        let firstSet = await Winary.find().where("_id").in(wineriesIds);
        let secondSet = await Catalogue.find({ _id: catalogueId })
            .populate("participatedWineries")
            .select("participatedWineries")
        
        secondSet = secondSet.map((x: any) => x.participatedWineries).flat();

        const finalSet = [...firstSet, ...secondSet
            .filter((x: any) => !firstSet.find(el => x.id == el.id))
        ];

        //return [...new Set([...firstSet, ...secondSet])];

        return finalSet;
    }

    // Admins part

    getCataloguesByAdmin = async (adminId: ObjectId) => {
        return await Catalogue.find({ adminId: adminId });
    }

    createCatalogue = async (catalogue: ICatalogue) => {
        const newCatalogue = new Catalogue(catalogue);
        await newCatalogue.save();
        return newCatalogue;
    }

    updateCatalogue = async (catalogueId: string, catalogue: ICatalogue) =>{
        return await Catalogue.findOneAndReplace({ _id: catalogueId }, catalogue);
    }

    deleteCatalogue = async (catalogueId: string, adminId: ObjectId) => {
        await Catalogue.deleteOne({ _id: catalogueId, adminId: adminId });
    }

    changePublishState = async (catalogueId: string, publishState: boolean) => {
        await Catalogue.updateOne({ _id: catalogueId }, { $set: { published: publishState } });
    }

    addParticipatedWinary = async (catalogueId: string, winaryId: string) => {
        await Catalogue.updateOne({ _id: catalogueId }, { $push: { participatedWineries: winaryId } });
    }

    removeParticipatedWinary = async (catalogueId: string, winaryId: string) => {
        await Catalogue.updateOne({ _id: catalogueId }, { $pull: { participatedWineries: winaryId } });
    }

    addCatalogueImages = async (catalogueId: string, imageUrls: string[]) => {
        await Catalogue.updateOne({ _id: catalogueId }, { $push: { imageUrl: { $each: imageUrls } } });
    }

    deleteCatalogueImage = async (catalogueId: string, imageUrl: string) => {
        await Catalogue.updateOne({ _id: catalogueId }, { $pull: { imageUrl: imageUrl } });
    }

    deleteSamplesByCatalogueId = async (catalogueId: string): Promise<void> => {
        await Sample.deleteMany({ catalogueId: catalogueId });
    }

    deleteSample = async (sampleId: string): Promise<void> => {
        await Sample.deleteOne({ _id: sampleId });
    }
}