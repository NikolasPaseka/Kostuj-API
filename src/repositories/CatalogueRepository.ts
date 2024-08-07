import { Catalogue, ICatalogue } from "../models/Catalogue";
import { GrapeVarietal } from "../models/GrapeVarietal";
import { Sample } from "../models/Sample";
import { Winary } from "../models/Winary";
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
        console.log(samplesResult);
        const wineIds: string[] = [];
        samplesResult.map(x => { wineIds.push(x.wineId.toString()) });

        const wineResults = await Wine.find().where("_id").in(wineIds);
        let wineriesIds: string[] = [];
        wineResults.map(x => { wineriesIds.push(x.winaryId.toString()) });

        wineriesIds = wineriesIds.filter(this.onlyUnique);
        return Winary.find().where("_id").in(wineriesIds);
    }
}