import { Catalogue, ICatalogue } from "../models/catalogue";
import { FollowedCatalogue } from "../models/followedCatalogues";
import { GrapeVarietal } from "../models/GrapeVarietal";
import { Sample } from "../models/sample";
import { Winary } from "../models/winary";
import { IWine, Wine } from "../models/wine";
import { ResponseError } from "../utils/ResponseError";


export class CatalogueRepository {
    private onlyUnique(value: any, index: any, self: any) {
        return self.indexOf(value) === index;
      }


    async getCatalogues(){
        return await Catalogue.find({});
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
        console.log(samplesResult);
        const wineIds: string[] = [];
        samplesResult.map(x => { wineIds.push(x.wineId.toString()) });

        const wineResults = await Wine.find().where("_id").in(wineIds);
        let wineriesIds: string[] = [];
        wineResults.map(x => { wineriesIds.push(x.winaryId.toString()) });

        wineriesIds = wineriesIds.filter(this.onlyUnique);
        return await Winary.find().where("_id").in(wineriesIds);
    }
}