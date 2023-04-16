import { Request, Response } from "express";

import { CatalogueRepository } from "../repositories/CatalogueRepository";
import { ResponseError } from "../utils/ResponseError";

export class CatalogueController {

    private catalogueRepository = new CatalogueRepository();

    getCatalogues = async (req: Request, res: Response) => {
        let page: number = parseInt(req.query.page as string);
        let limit: number = parseInt(req.query.limit as string);
        if (Number.isNaN(page) || Number.isNaN(limit)) {
            throw new ResponseError("Invalid page or limit query");
        }

        const catalogues = await this.catalogueRepository.getCatalogues(page, limit);

        res.json(catalogues);
    }

    getCatalogueBySearch = async (req: Request, res: Response) => {
        const title: string = req.query.title as string;
        const catalogues = await this.catalogueRepository.getCatalogueByTitle(title);

        res.json(catalogues);
    }

    getCatalogueDetail = async (req: Request, res: Response) => {
        const { id } = req.params;
        const catalogue = await this.catalogueRepository.getCatalogueDetail(id);

        res.json(catalogue);
    }

    getCatalogueSamples = async (req: Request, res: Response) => {
        const { id } = req.params;
        const samples = await this.catalogueRepository.getCatalogueSamples(id);

        res.json(samples);
    }

    getCatalogueSampleDetail = async (req: Request, res: Response) => {
        const { id } = req.params;
        const sample = await this.catalogueRepository.getCatalogueSampleDetail(id);

        res.json(sample);
    }

    getParticipatedWineries = async (req: Request, res: Response) => {
        const { id } = req.params;
        const wineries = await this.catalogueRepository.getParticipatedWineries(id);

        res.json(wineries);
    }
}