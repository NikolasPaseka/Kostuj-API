import { Request, Response } from "express";
import { IUser } from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { SECRET_KEY, TokenRequest } from "../middleware/auth";
import { UserRepository } from "../repositories/UserRepository";
import { ResponseError } from "../utils/ResponseError";
import { CatalogueRepository } from "../repositories/CatalogueRepository";
import { ITastedSample } from "../models/TastedSample";

export class UserController {
    private userRepository = new UserRepository();
    private catalogueRepository = new CatalogueRepository();

    getUserById = async (req: Request, res: Response) => {
        const { id } = req.params;
        const user: IUser = await this.userRepository.getUserById(id);

        res.json(user);
    }

    register = async (req: Request, res: Response) => {
        const user = req.body;

        await this.userRepository.createUser(user);

        return await this.login(req, res);
    }

    login = async (req: Request, res: Response) => {
        const { email, password } = req.body;
        const foundUser = await this.userRepository.getUserByEmail(email);

        const isMatch = bcrypt.compareSync(password, foundUser.password);
    
        if (isMatch) {
            const token = jwt.sign({ _id: foundUser._id?.toString(), email: foundUser.email }, SECRET_KEY, {});
            return res.json({
                id: foundUser._id,
                email: foundUser.email,
                token: token
            });
        } else {
            throw new ResponseError("Incorrect credentials");
        }
    }

    deleteUser = async (req: TokenRequest, res: Response) => {
        const userId = req.token._id.toString();

        await this.userRepository.deleteUser(userId);
        res.json("User deleted");
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

    getTastedSamples = async (req: TokenRequest, res: Response) => {
        const userId = req.token._id.toString();
        const catalogueId = req.params.catalogueId;

        const tastedSamples = await this.userRepository.getTastedSamples(catalogueId, userId);
        res.json(tastedSamples);
    }

    updateTastedSamples = async (req: TokenRequest, res: Response) => {
        const userId = req.token._id.toString();
        const tastedSamples: ITastedSample[] = req.body;

        await this.userRepository.updateTastedSamples(tastedSamples, userId);
        res.json("Successfuly updated");
    }

    deleteTastedSamples = async (req: TokenRequest, res: Response) => {
        const userId = req.token._id.toString();
        const tastedSamples: ITastedSample[] = req.body;

        await this.userRepository.deleteTastedSamples(tastedSamples, userId);
        res.json("Successfuly deleted");
    }
}