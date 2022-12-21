import { Catalogue, ICatalogue } from "../models/catalogue";
import { FollowedCatalogue } from "../models/followedCatalogues";
import { Sample } from "../models/sample";
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
        .populate({ path: 'wineId', model: Wine });
    }

    async getFollowedCatalogue(catalogueId: string, userId: string) {
       return await FollowedCatalogue.findOne({ catalogueId, userId });
    }

    async followCatalogue(catalogueId: string, userId: string) {
        const followedCatalogue = new FollowedCatalogue({ catalogueId: catalogueId, userId: userId });
        await followedCatalogue.save();
    }

    async unfollowCatalogue(id: string) {
        await FollowedCatalogue.findOneAndDelete({_id: id});
    }
}