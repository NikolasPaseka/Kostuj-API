import { ObjectId } from "mongoose";
import { Catalogue, ICatalogue } from "../models/Catalogue";
import { GrapeVarietal, IGrapeVarietal } from "../models/GrapeVarietal";
import { ISample, Sample } from "../models/Sample";
import { IWinary, Winary, WineryUtil } from "../models/Winary";
import { IWine, Wine, WineUtil } from "../models/Wine";
import { ResponseError } from "../utils/ResponseError";
import { WineColorOptions } from "../models/utils/WineColorOptions";
import { WineRepository } from "./WineRepository";
import { User } from "../models/User";


export class CatalogueRepository {
    private wineRepository = new WineRepository();

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
        const catalogue = await Catalogue.findById(catalogueId)
            .populate({
                path: "coorganizators",
                model: User,
            })

        if (catalogue == null) {
            throw new ResponseError("Catalogue not found", 404);
        }

        return catalogue;
    }

    getCatalogueSamplesColorCounts = async (catalogueId: string) => {
        const samples = await this.getCatalogueSamples(catalogueId);
        const colorCounts = new Map<string, number>([
            [WineColorOptions.RED, 0],
            [WineColorOptions.WHITE, 0],
            [WineColorOptions.ROSE, 0]
        ]);
        samples.forEach(sample => {
            const wine = sample.wineId as unknown as IWine;
            if (wine.color == null) { return; }
            colorCounts.set(wine.color, (colorCounts.get(wine.color) ?? 0) + 1);
        });
        return colorCounts;
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
                model: Winary,
            }, {
                path: "grapeVarietals",
                model: GrapeVarietal
            }]
        }, );
    }

    async getCatalogueSampleDetail(id: string) {
        return await Sample.findById(id)
        .populate({ 
            path: "wineId", 
            model: Wine,
            populate: {
                path: "winaryId",
                model: Winary
            }
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

    increaseDownloadCount = async (catalogueId: string) => {
        await Catalogue.updateOne({ _id: catalogueId }, { $inc: { downloads: 1 } });
    }

    // Admins part
    getCataloguesByAdmin = async (adminId: ObjectId) => {
        return await Catalogue.find({ 
            $or: [
                { adminId: adminId },
                { coorganizators: adminId }
            ]
        });
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

    addCoorganizatorToCatalogue = async (catalogueId: string, coorganizatorId: string) => {
        await Catalogue.updateOne({ _id: catalogueId }, { $push: { coorganizators: coorganizatorId } });
    }

    removeCoorganizatorFromCatalogue = async (catalogueId: string, coorganizatorId: string) => {
        await Catalogue.updateOne({ _id: catalogueId }, { $pull: { coorganizators: coorganizatorId } });
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

    importContentData = async (catalogueId: string, wineries: any, samples: any, adminId: string) => {
        const startTime = new Date().getTime();
        type WineryImported = IWinary & { importedId: number };
        const grapeVarietals: IGrapeVarietal[] = await this.wineRepository.getGrapeVarietals();

        //delete all participated TODO DELETE LATER
        const catalogue = await this.getCatalogueDetail(catalogueId);
        if (catalogue.participatedWineries != null) {
            //this.deleteAllParticipatedWineries(catalogueId);
        }
        ////////////////////////////////
        console.log("wineries: " + wineries.length);
        let wineriesToSave: WineryImported[] = [];
        let alreadyCreatedWineries: WineryImported[] = []; 
        const adminWineries = await Winary.find({ adminId: adminId }).lean();

        for (const winery of wineries) {
            const existingWinery: IWinary | null = WineryUtil.checkWineryExists(adminWineries, winery, adminId);
            if (existingWinery) {
                alreadyCreatedWineries.push({ ...existingWinery, importedId: Number(winery.id) });
            } else {
                wineriesToSave.push({ ...winery, importedId: Number(winery.id) });
            }
        }

        console.log("wineries to save: " + wineriesToSave.length);
        console.log("Already created wineries: " + alreadyCreatedWineries.length);

        const wineriesResult: IWinary[] = [...(await Winary.insertMany(wineriesToSave)).map(it => it.toObject()), ...alreadyCreatedWineries];
        console.log(wineriesResult[0]);

        const wineriesFinal: WineryImported[] = [];
        wineriesResult.forEach((winery: IWinary) => {
            if (winery._id == null) { return; }

            const matchedWinery = WineryUtil.checkWineryExists(wineries, winery, adminId);
            if (matchedWinery == null || matchedWinery.id == null) { return; }

            wineriesFinal.push({ 
                ...winery, 
                importedId: Number(matchedWinery.id)
            });
            //this.addParticipatedWinary(catalogueId, winery._id.toString());
        });
        console.log("Wineries final: " + wineriesFinal.length);

        // Delete all samples
        //this.deleteSamplesByCatalogueId(catalogueId);

        //  Create new samples
        const samplesToSave: ISample[] = [];
        const winesToSave: IWine[] = [];
        const winesAlreadyCreated: IWine[] = [];
        //samples.forEach(async (sample: { wineId: IWine; }, index: number) => {

        const wineriesWines = await this.wineRepository.getWinesByWineries(wineriesFinal.map(winery => winery._id?.toString() ?? ""));
        for (const sample of samples) {

            const wine = sample.wineId as IWine;
            const wineryId = wine.winaryId as unknown as number;
            const foundWineryId = wineriesFinal.find(winery => winery.importedId == wineryId)?._id;
            if (foundWineryId == null) { continue; }

            const wineryWines = wineriesWines.filter(w => w.winaryId?.toString() === foundWineryId.toString());
            const foundWine = WineUtil.checkWineExists(wineryWines, wine, foundWineryId.toString());

            wine.winaryId = foundWineryId;
            if (foundWine != null) {
                winesAlreadyCreated.push(foundWine);
            } else {

                if (wine.grapeVarietals == null || wine.grapeVarietals.length == 0) { 
                    const foundGrapeVariatal = grapeVarietals.find(g => g.grape == wine.name)?._id
                    if (foundGrapeVariatal) { wine.grapeVarietals = [foundGrapeVariatal] }
                }
                winesToSave.push(wine);
            }
        }
        console.log("Wines already created: " + winesAlreadyCreated.length);
        console.log("Wines to save: " + winesToSave.length);

        const finalWines: IWine[] = [...((await Wine.insertMany(winesToSave)).map(it => it.toObject())), ...winesAlreadyCreated];

        samples.forEach((sample: ISample, index: string | number) => {
            const wine = sample.wineId as unknown as IWine;
            const wineryId = wine.winaryId;

            const foundWineryId = wineriesFinal.find(winery => winery._id == wineryId)?._id;
            if (foundWineryId == null) { return; }

            const foundWine = WineUtil.checkWineExists(finalWines, wine, foundWineryId.toString());
            if (foundWine == null) { return; }

            sample.wineId = foundWine._id;
            samplesToSave.push(sample);
        });
        console.log("Samples to save: " + samplesToSave.length);
        await Sample.insertMany(samplesToSave);
        const endTime = new Date().getTime();
        console.log("Import time: " + (endTime - startTime) + "ms");
    }
}