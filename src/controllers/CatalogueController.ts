import { Request, Response } from "express";
import fs from "fs";
import { CatalogueRepository } from "../repositories/CatalogueRepository";
import { ResponseError } from "../utils/ResponseError";
import {IWinary, Winary, WineryDomain} from "../models/Winary";
import { TokenRequest } from "../middleware/auth";
import mongoose, { Mongoose, ObjectId } from "mongoose";
import { ICatalogue } from "../models/Catalogue";
import { WineRepository } from "../repositories/WineRepository";
import { WinaryRepository } from "../repositories/WinaryRepository";
import { IUser } from "../models/User";
import { handleDeleteImage, handleImagesUpload, handleImageUpload } from "../utils/handleImageUpload";
import { generateRandomHash } from "../utils/randomHash";
import { IWine } from "../models/Wine";
import { ISample, Sample } from "../models/Sample";

export class CatalogueController {

    private catalogueRepository = new CatalogueRepository();
    private wineryRepository = new WinaryRepository();
    private wineRepository = new WineRepository();

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
        catalogue.imageUrl?.forEach(async (imageUrl) => {
            this.catalogueRepository.deleteCatalogueImage(id, imageUrl);
            handleDeleteImage(imageUrl, "kostuj_catalogues");
        });

        // Delete all samples associated with this catalogue
        this.catalogueRepository.deleteSamplesByCatalogueId(id);

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
            const newWinery = await this.wineryRepository.createWinary(winery);
            await this.catalogueRepository.addParticipatedWinary(id, newWinery._id.toString());
            return res.json(newWinery);
        }
        const participatedWineries = await this.catalogueRepository.getParticipatedWineries(id);
        if (participatedWineries.map(winery => winery.id).includes(winery.id)) {
            throw new ResponseError("Winery already participated", 400);
        }

        await this.catalogueRepository.addParticipatedWinary(id, winery.id);
        res.json(winery);
    }

    removeParticipatedWinery = async (req: TokenRequest, res: Response) => {
        const { id } = req.params;
        const wineryToRemove: WineryDomain = req.body;

        if (wineryToRemove.id == null) {
            throw new ResponseError("Invalid winery id", 400);
        }
        
        const participatedWineries = await this.catalogueRepository.getParticipatedWineries(id);
        if (!participatedWineries?.map(winery => winery.id).includes(wineryToRemove.id)) {
            throw new ResponseError("Winery not participated", 400);
        }
        const catalogueSamples = await this.catalogueRepository.getCatalogueSamples(id);
        const samplesToRemove = catalogueSamples.filter(sample => {
            const wine = sample.wineId as IWine | undefined;
            const winery = wine?.winaryId as IWinary | undefined;
            if (wine != undefined && winery != undefined) {
                return winery._id?.toString() == wineryToRemove.id;
            } else {
                return false;
            }
        });
        console.log(`catalogue samples: ${catalogueSamples.length}`);
        console.log(`samples to remove: ${samplesToRemove.length}`);
    
        //Remove the identified samples from the catalogue
        for (const sample of samplesToRemove) {
            await this.catalogueRepository.deleteSample(sample._id.toString());
        }
    
        // Remove the winery from the catalogue
        await this.catalogueRepository.removeParticipatedWinary(id, wineryToRemove.id);
        res.json({ message: "Winery and associated samples removed successfully" });
    }

    uploadCatalogueImages = async (req: TokenRequest, res: Response) => {
        const userId: ObjectId = req.token._id;
        const catalogueId: string = req.params.id;
        const catalogueImages= req.files as Express.Multer.File[];

        if (catalogueImages == null) {
            throw new ResponseError("No image provided", 400);
        }

        const imageUrls = await handleImagesUpload(
            catalogueId.toString(),
            generateRandomHash(),
            "kostuj_catalogues",
            catalogueImages
        );

        this.catalogueRepository.addCatalogueImages(catalogueId, imageUrls);
        res.json(imageUrls);
    }

    deleteCatalogueImage = async (req: TokenRequest, res: Response) => {
        const { id } = req.params;
        const imageUrl: string = req.body.imageUrl;

        await handleDeleteImage(imageUrl, "kostuj_catalogues");

        await this.catalogueRepository.deleteCatalogueImage(id, imageUrl);
        res.json({ "message": "Image deleted" });
    }

    deleteCatalogueSample = async (req: TokenRequest, res: Response) => {
        const { id } = req.params;

        await this.catalogueRepository.deleteSample(id);
        res.json({ "message": "Sample deleted" });
    }

    importContentData = async (req: Request, res: Response) => {
        const { id } = req.params;
        const { wineries, samples } = req.body;
        const savedWineries: (IWinary & { importedId: number })[] = [];

        //delete all participated TODO DELETE LATER
        const catalogue = await this.catalogueRepository.getCatalogueDetail(id);
        if (catalogue.participatedWineries != null) {
            Winary.deleteMany({ _id: { $in: [...catalogue.participatedWineries] } });
            this.catalogueRepository.deleteAllParticipatedWineries(id);
        }
        ////////////////////////////////

        const savePromises = wineries.map(async (winery) => {
            const savedWinery = await this.wineryRepository.createWinary(winery);
            this.catalogueRepository.addParticipatedWinary(id, savedWinery._id.toString());
            savedWineries.push({ 
                ...savedWinery.toObject(),
                importedId: winery.id
            });
        });
        await Promise.all(savePromises);

        // Delete all samples
        this.catalogueRepository.deleteSamplesByCatalogueId(id);

        // Create new samples
        const samplesToCreate: ISample[] = [];
        const savedSamplesPromises = samples.map(async (sample) => {
            const wine = sample.wineId as IWine;
            const wineryId = wine.winaryId as unknown as number;
            const foundWineryId = savedWineries.find(winery => winery.importedId == wineryId)?._id;
            
            if (foundWineryId == null) { return; }

            wine.winaryId = foundWineryId;
            const savedWine = await this.wineRepository.createWine(wine);
            sample.wineId = savedWine._id;
            samplesToCreate.push(sample);
        });

        await Promise.all(savedSamplesPromises);
        await Sample.insertMany(samplesToCreate);

        res.json({ "message": "Data imported" });
    }
}