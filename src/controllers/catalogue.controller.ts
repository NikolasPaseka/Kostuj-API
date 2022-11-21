import { Request, Response } from "express";
import { Catalogue } from "../models/catalogue";
import { Sample } from "../models/sample";
import { Wine } from "../models/wine";

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
}