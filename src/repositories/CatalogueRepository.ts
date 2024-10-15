import { ObjectId } from "mongoose";
import { Catalogue, ICatalogue } from "../models/Catalogue";
import { GrapeVarietal } from "../models/GrapeVarietal";
import { ISample, Sample } from "../models/Sample";
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
        return await Sample.find({
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
        return await Sample.findById(id)
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
        wineResults.map(x => { wineriesIds.push(x.winaryId?.toString() ?? "") });

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

    addParticipatedWineries = async (catalogueId: string, winaryIds: string[]) => {
        await Catalogue.updateOne({ _id: catalogueId }, { $push: { participatedWineries: { $each: winaryIds } } });
    }

    removeParticipatedWinary = async (catalogueId: string, winaryId: string) => {
        await Catalogue.updateOne({ _id: catalogueId }, { $pull: { participatedWineries: winaryId } });
    }

    deleteAllParticipatedWineries = async (catalogueId: string) => {
        await Catalogue.updateOne({ _id: catalogueId }, { $set: { participatedWineries: [] } });
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

    // import and export
    importContentData = async (catalogueId: string, wineries: any, samples: any) => {
        const savedWineries: (IWinary & { importedId: number })[] = [];

        //delete all participated TODO DELETE LATER
        const catalogue = await this.getCatalogueDetail(catalogueId);
        if (catalogue.participatedWineries != null) {
            const res = await Winary.deleteMany({ _id: { $in: [...catalogue.participatedWineries] } });
            console.log(res.deletedCount);
            this.deleteAllParticipatedWineries(catalogueId);
        }
        ////////////////////////////////

        const wineriesResult = await Winary.insertMany(wineries);
        const test = wineriesResult[89].toObject() as IWinary;
        console.log(test.name);
        console.log(test._id)
        console.log(wineries[89].name)

        wineriesResult.forEach((winery, index) => {
            const savedWinery = winery.toObject() as IWinary;
            if (savedWinery._id != null) {
                this.addParticipatedWinary(catalogueId, savedWinery._id.toString());
            }
           
            const importedWinery = wineries[index];
            if (importedWinery == null || importedWinery.name != savedWinery.name) { return; }
            savedWineries.push({
                ...winery.toObject(),
                importedId: wineries[index].id
            })
        });

        // Delete all samples
        this.deleteSamplesByCatalogueId(catalogueId);
        await Wine.deleteMany({ name: { $in: [...samples.map(it => (it.wineId as IWine).name)] } });

        // Create new samples
        const samplesToSave: ISample[] = [];
        const winesToSave: IWine[] = [];
        
        samples.forEach((sample: { wineId: IWine; }, index: number) => {
            const wine = sample.wineId as IWine;
            const wineryId = wine.winaryId as unknown as number;
            const foundWineryId = savedWineries.find(winery => winery.importedId == wineryId)?._id;
            if (foundWineryId == null) { return; }

            wine.winaryId = foundWineryId;
            winesToSave.push(wine);
        });
        const insertedWines = await Wine.insertMany(winesToSave);

        samples.forEach((sample: ISample, index: string | number) => {
            const wine = insertedWines[index] as IWine;
            const sampleToSave = sample as ISample;
            sampleToSave.wineId = wine._id;
            samplesToSave.push(sampleToSave);
        });
        await Sample.insertMany(samplesToSave);
    }
}