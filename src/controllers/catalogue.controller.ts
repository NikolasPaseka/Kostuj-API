import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { TokenRequest } from "../middleware/auth";
import { Catalogue } from "../models/catalogue";
import { FollowedCatalogue } from "../models/followedCatalogues";
import { Sample } from "../models/sample";
import { IWine, Wine } from "../models/wine";

export class CatalogueController {

    async getCatalogues(req: Request, res: Response) {
        const catalogues = await Catalogue.find({});
        res.status(200).json(catalogues);
    }

    async getCatalogueDetail(req: Request, res: Response) {
        const { id } = req.params;
        const catalogue = await Catalogue.findById(id);
        if (catalogue != null) {
            res.status(200).json(catalogue);
        } else {
            res.status(404);
        }
    }

    async getCatalogueSamples(req: Request, res: Response) {
        const { id } = req.params;
        const samples = await Sample.find({
            catalogueId: id
        })
        .populate({ path: 'wineId', model: Wine });

        res.status(200).json(samples)
    }

    async getSampleCountsByColor(req: Request, res: Response) {
        const { id } = req.params;
        const samples = await Sample.find({
            catalogueId: id,
        }).populate({ path: 'wineId', model: Wine });
        
        let countsMap = new Map<string, number>([
            ["red", 0],
            ["white", 0],
            ["rose", 0]
        ]);

        for (const sample of samples) {
            if (sample.wineId instanceof Wine) {
                const color = sample.wineId.color;
                countsMap.set(color, (countsMap.get(color) ?? 0) + 1);
            }
        }
        const countsObject = Object.fromEntries(countsMap);

        res.status(200).json(countsObject);
    }

    async changeUserFollowState(req: TokenRequest, res: Response) {
        const catalogueId = req.params.id;
        const follow: boolean = req.body.follow;
        const token = req.token;

        //Check if is already followed
        const result = await FollowedCatalogue.findOne({ catalogueId: catalogueId, userId: token._id });

        if (follow && !result) {
            const followedCatalogue = new FollowedCatalogue({ catalogueId: catalogueId, userId: token._id });
            followedCatalogue.save();
            return res.status(200).send("followed");
        }
        if (!follow && result) {
            await FollowedCatalogue.findOneAndDelete({_id: result?._id});
            return res.status(200).send("unfollowed");
        }
        
        return res.status(500).send("error while performing operation");
    }
}