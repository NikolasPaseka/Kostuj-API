import { Request, Response } from "express";

import { CatalogueRepository } from "../repositories/CatalogueRepository";
import { ResponseError } from "../utils/ResponseError";
import {IWinary, WineryDomain} from "../models/Winary";
import { TokenRequest } from "../middleware/auth";
import mongoose, { Mongoose, ObjectId } from "mongoose";
import { ICatalogue } from "../models/Catalogue";
import { WineRepository } from "../repositories/WineRepository";
import { WinaryRepository } from "../repositories/WinaryRepository";
import { IUser } from "../models/User";

export class CatalogueController {

    private catalogueRepository = new CatalogueRepository();
    private wineryRepository = new WinaryRepository();

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

    // Admins part
    getCataloguesByAdmin = async (req: TokenRequest, res: Response) => {
        const adminId: ObjectId = req.token._id;

        const adminCatalogues = await this.catalogueRepository.getCataloguesByAdmin(adminId);
        res.json(adminCatalogues);
    }

    createCatalogue = async (req: TokenRequest, res: Response) => {
        const adminId: ObjectId = req.token._id;
        const catalogue = req.body as ICatalogue;

        if (catalogue.adminId != adminId) {
            throw new ResponseError("Invalid admin id", 401);
        }
        
        // TODO: add validation
        const newCatalogue = await this.catalogueRepository.createCatalogue(catalogue);
        res.json(newCatalogue);
    }

    updateCatalogue = async (req: TokenRequest, res: Response) => {
        const { id } = req.params;
        const adminId: ObjectId = req.token._id;
        const catalogue = req.body as ICatalogue;

        if (catalogue.adminId != adminId) {
            throw new ResponseError("Invalid admin id", 401);
        }

        await this.catalogueRepository.updateCatalogue(id, catalogue);
        res.json({ "message": "Catalogue updated" });
    }

    deleteCatalogue = async (req: TokenRequest, res: Response) => {
        const { id } = req.params;
        const adminId: ObjectId = req.token._id;

        const catalogue = await this.catalogueRepository.getCatalogueDetail(id);
        if (catalogue.adminId != adminId) {
            throw new ResponseError("Invalid admin id", 401);
        }

        await this.catalogueRepository.deleteCatalogue(id, adminId);
        res.json({ "message": "Catalogue deleted" });
    }

    changePublishState = async (req: TokenRequest, res: Response) => {
        const { id } = req.params;
        const { publish } = req.body;
        const adminId: ObjectId = req.token._id;

        const catalogue = await this.catalogueRepository.getCatalogueDetail(id);
        if (catalogue.adminId != adminId) {
            throw new ResponseError("Invalid admin id", 401);
        }

        await this.catalogueRepository.changePublishState(id, publish);
        res.json({ "message": "Publish state changed" });
    }

    addParticipatedWinery = async (req: TokenRequest, res: Response) => {
        const { id } = req.params;
        const winery: WineryDomain = req.body;

        if (winery.id == null || winery.id.length == 0) {
            //throw new ResponseError("Invalid winary id", 400);
            const newWinery = await this.wineryRepository.createWinary(winery);
            await this.catalogueRepository.addParticipatedWinary(id, newWinery._id.toString());
            return res.json({ "message": "Winery added & created" });
        }

        await this.catalogueRepository.addParticipatedWinary(id, winery.id);
        res.json({ "message": "Winery added" });
    }
}