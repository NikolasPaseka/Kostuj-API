import { Request, Response } from "express";
import { IUser, User } from "../models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { SECRET_KEY, TokenRequest } from "../middleware/auth";
import { UserRepository } from "../repositories/UserRepository";
import { ResponseError } from "../utils/ResponseError";
import { WineRepository } from "../repositories/WineRepository";
import { CatalogueRepository } from "../repositories/CatalogueRepository";

export class UserController {
    private userRepository = new UserRepository();
    private catalogueRepository = new CatalogueRepository();

    getUsers = async (req: Request, res: Response) => {
        const users: IUser[] = await this.userRepository.getUsers();

        res.json(users);
    }

    getUserById = async (req: Request, res: Response) => {
        const { id } = req.params;
        const user: IUser = await this.userRepository.getUserById(id);

        res.json(user);
    }

    register = async (req: Request, res: Response) => {
        const user = req.body;

        await this.userRepository.createUser(user);
        //res.send("Successfully registered");
        return await this.login(req, res);
    }

    login = async (req: Request, res: Response) => {
        const { email, password } = req.body;
        const foundUser = await this.userRepository.getUserByEmail(email);

        const isMatch = bcrypt.compareSync(password, foundUser.password);
    
        if (isMatch) {
            const token = jwt.sign({ _id: foundUser._id?.toString(), email: foundUser.email }, SECRET_KEY, {
                expiresIn: '15 days',
            });
         
            return res.json({
                id: foundUser._id,
                email: foundUser.email,
                token: token
            });
        } else {
            throw new ResponseError("Incorrect credentials");
        }
    }

    getCommissionCatalogues = async (req: TokenRequest, res: Response) => {
        const userId = req.token._id.toString();
        const commissionCatalogues = await this.userRepository.getCommissionCatalogues(userId);
        
        const result: {}[] = [];
        for (const catalogue of commissionCatalogues) {
            const ratedSamples = await this.userRepository.getRatedSamples(userId, catalogue.id);
            const samples = await this.catalogueRepository.getCatalogueSamples(catalogue.id)
            result.push({ 
                id: catalogue.id,
                title: catalogue.title,
                startDate: catalogue.startDate,
                imageUrl: catalogue.imageUrl,
                numberOfRated: ratedSamples.length,
                numberOfSamples: samples.length
            });
        }
        return res.json(result);
    }

    getRatedSamples = async (req: TokenRequest, res: Response) => {
        const userId = req.token._id.toString();
        const catalogueId = req.params.catalogueId;
        
        const result: {}[] = [];
        const ratedSamples = await this.userRepository.getRatedSamples(userId, catalogueId);
        for (const ratedSample of ratedSamples) {
            result.push({
                id: ratedSample.id,
                commissionMemberId: ratedSample.commissionMemberId,
                sampleId: ratedSample.sampleId,
                rating: ratedSample.rating
            })
        }

        return res.json(result);
    }

    addRatedSample = async (req: TokenRequest, res: Response) => {
        const userId = req.token._id.toString();
        const sampleId: string = req.body.sampleId;
        const rating: number = req.body.rating;

        const ratedSample = await this.userRepository.addRatedSample(userId, sampleId, rating, false);
        res.json(ratedSample);
    }

    updateRatedSample = async (req: TokenRequest, res: Response) => {
        const userId = req.token._id.toString();
        const sampleId: string = req.body.sampleId;
        const rating: number = req.body.rating;

        const ratedSample = await this.userRepository.addRatedSample(userId, sampleId, rating, true);
        res.json(ratedSample);
    }

    getFavoriteWineState = async (req: TokenRequest, res: Response) => {
        const wineId = req.params.wineId;
        const userId = req.token._id.toString();

        const result = await this.userRepository.getFavoriteWine(wineId, userId);
        let isFavorite: boolean = false;
        let notes: string = "";
        if (result != null) {
            isFavorite = true;
            notes = result.notes;
        }

        return res.json({
            favorite: isFavorite,
            notes: notes
        });
    }

    changeFavoriteWineState = async (req: TokenRequest, res: Response) => {
        const wineId = req.params.wineId;
        const userId = req.token._id.toString();
        const favorite: boolean = req.body.favorite;

        const result = await this.userRepository.getFavoriteWine(wineId, userId)

        if (favorite && !result) {
            this.userRepository.changeFavoriteWineState(wineId, userId, true);
            return res.send("Wine added to favorites");
        }
        else if (!favorite && result) {
            this.userRepository.changeFavoriteWineState(wineId, userId, false, result.id);
            return res.send("Wine removed from favorites");
        } else {
            throw new ResponseError("Error occured while performing favorite wine request");
        }
    }

    getFavoriteWines = async (req: TokenRequest, res: Response) => {
        const userId = req.token._id.toString();
        const favoriteWines = await this.userRepository.getFavoriteWines(userId);

        return res.json(favoriteWines);
    }

    updateFavoriteWineNotes = async (req: TokenRequest, res: Response) => {
        const wineId = req.params.wineId;
        const userId = req.token._id.toString();
        const notes: string = req.body.notes;
        
        await this.userRepository.updateFavoriteWineNotes(wineId, userId, notes);
        return res.send("Notes have been succesfully saved");
    }
}