import { NextFunction, Request, Response } from "express";
import { IUser } from "../models/User";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import { authEnv, generateAccessToken, generateRefreshToken, TokenRequest } from "../middleware/auth";
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
            const accessToken = generateAccessToken(foundUser._id.toString(), foundUser.email);
            const refreshToken = generateRefreshToken(foundUser._id.toString());
            this.userRepository.addUserRefreshToken(foundUser.id, refreshToken);
            return res.json({
                id: foundUser._id,
                email: foundUser.email,
                accessToken: accessToken,
                refreshToken: refreshToken
            });
        } else {
            throw new ResponseError("Incorrect credentials", 401);
        }
    }

    loginGoogle = async (req: TokenRequest, res: Response) => {
        console.log("GOOGLE LOGIN")
        res.send("GOOGLE LOGIN")
    }

    refreshToken = async (req: Request, res: Response) => {
        const { email, refreshToken } = req.body;
        if (refreshToken == null || email == null) {
            throw new ResponseError("Invalid Request", 400);
        }

        const foundUser = await this.userRepository.getUserByEmail(email);
        try {
            jwt.verify(refreshToken, authEnv.REFRESH_TOKEN_SECRET);
        } catch {
            await this.userRepository.deleteAllUserRefreshTokens(foundUser._id.toString());
            throw new ResponseError("Cannot verify refresh token", 401);
        }
        if (!foundUser.refreshTokens.includes(refreshToken)) {
            await this.userRepository.deleteAllUserRefreshTokens(foundUser._id.toString());
            throw new ResponseError("Invalid refresh token", 401);
        }

        const accessToken = generateAccessToken(foundUser._id.toString(), foundUser.email);
        const newRefreshToken = generateRefreshToken(foundUser._id.toString());
        await this.userRepository.deleteUserRefreshToken(foundUser._id.toString(), refreshToken);
        await this.userRepository.addUserRefreshToken(foundUser._id.toString(), newRefreshToken);

        res.json({ 
            accessToken: accessToken,
            refreshToken: newRefreshToken
        });
    }

    logout = async (req: TokenRequest, res: Response) => {
        const userId = req.token._id;
        await this.userRepository.deleteAllUserRefreshTokens(userId.toString());
        res.json("Succesfuly logout");
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