import { Catalogue, ICatalogue } from "../models/catalogue";
import { FollowedCatalogue } from "../models/followedCatalogues";
import { GrapeVarietal } from "../models/GrapeVarietal";
import { Sample } from "../models/sample";
import { Winary } from "../models/winary";
import { IWine, Wine } from "../models/wine";
import { ResponseError } from "../utils/ResponseError";


export class CatalogueRepository {

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
}