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
import { IWine, Wine } from "../models/Wine";
import { ISample, Sample } from "../models/Sample";
import { IGrapeVarietal } from "../models/GrapeVarietal";
import { AuthorizationRoles } from "../models/utils/AuthorizationRoles";

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
        //const start = new Date().getTime();
        const { id } = req.params;
        const catalogue = await this.catalogueRepository.getCatalogueDetail(id);
        const participatedWineriesCount = (await this.catalogueRepository.getParticipatedWineries(id)).length;
        const samplesColorCounts = await this.catalogueRepository.getCatalogueSamplesColorCounts(id);
        
        res.json({ 
            id: catalogue.id, 
            ...catalogue.toObject(), 
            participatedWineriesCount, 
            samplesColorCounts: Object.fromEntries(samplesColorCounts) 
        });
        //console.log(`Get catalogue detail took: ${new Date().getTime() - start} ms`);
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
        // if (catalogue.adminId != adminId) {
        //     throw new ResponseError("Invalid admin id", 401);
        // }
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

        const adminIdFromCatalogue = (catalogue.adminId as unknown as IUser)?._id;
        if (!adminIdFromCatalogue || adminIdFromCatalogue.toString() !== adminId.toString()) {
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
        
        await this.catalogueRepository.importContentData(id, wineries, samples);

        res.json({ "message": "Data imported" });
    }

    // Auto label
    autoLabelSamples = async (req: Request, res: Response) => {
        const start = new Date().getTime();

        const { id } = req.params;
        const { prefix, order, colorOrder } = req.query;
        const parsedColorOrder = (colorOrder as string).split(",");

        const samples = await this.catalogueRepository.getCatalogueSamples(id);

        // Sort by winary name
        if (order == "byWinery") {
            samples.sort((a, b) => {
                const wineryA = (a.wineId as unknown as IWine).winaryId as unknown as IWinary;
                const wineryB = (b.wineId as unknown as IWine).winaryId as unknown as IWinary;
                return wineryA.name.localeCompare(wineryB.name);
            });
        } else if (order == "byGrape") {
            samples.sort((a, b) => {
                const grapesA = (a.wineId as unknown as IWine).grapeVarietals as unknown as IGrapeVarietal[];
                const grapesB = (b.wineId as unknown as IWine).grapeVarietals as unknown as IGrapeVarietal[];
                
                const grapeA = grapesA.length > 0 ? grapesA[0].grape : "";
                const grapeB = grapesB.length > 0 ? grapesB[0].grape : "";
                return grapeA.localeCompare(grapeB);
            });
        } else if (order == "byGrapeColor") {
            samples.sort((a, b) => {
                const grapeA: string = (a.wineId as unknown as IWine).color
                const grapeB: string = (b.wineId as unknown as IWine).color
            
                if (parsedColorOrder.includes(grapeA) && parsedColorOrder.includes(grapeB)) {
                    if (parsedColorOrder.indexOf(grapeA) < parsedColorOrder.indexOf(grapeB)) return -1;
                    if (parsedColorOrder.indexOf(grapeA) > parsedColorOrder.indexOf(grapeB)) return 1;
                    return 0;
                }
                return grapeA.localeCompare(grapeB);
            });
        }

        samples.forEach((sample: ISample, index: number) => {
            sample.name = `${prefix}${index + 1}`;
        });

        const bulkOperations = samples.map(sample => ({
            updateOne: {
                filter: { _id: sample._id },
                update: { name: sample.name }
            }
        }));

        await Sample.bulkWrite(bulkOperations);

        console.log(`Auto label samples took: ${new Date().getTime() - start} ms`);
    
        res.json(samples);
    }
}