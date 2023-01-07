import { Request, Response } from "express";
import { IUser, User } from "../models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { SECRET_KEY, TokenRequest } from "../middleware/auth";
import { UserRepository } from "../repositories/UserRepository";
import { ResponseError } from "../utils/ResponseError";
import { WineRepository } from "../repositories/WineRepository";

export class UserController {
    private userRepository = new UserRepository();

    getUsers = async (req: Request, res: Response) => {
        const users: IUser[] = await this.userRepository.getUsers();

        res.json(users);
    }

    register = async (req: Request, res: Response) => {
        const { email, password } = req.body;

        await this.userRepository.createUser(email, password);
        res.json({ message: "Successfully registered" });
    }

    login = async (req: Request, res: Response) => {
        const { email, password } = req.body;
        const foundUser = await this.userRepository.getUserByEmail(email);

        const isMatch = bcrypt.compareSync(password, foundUser.password);
    
        if (isMatch) {
            const token = jwt.sign({ _id: foundUser._id?.toString(), email: foundUser.email }, SECRET_KEY, {
                expiresIn: '2 days',
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

    getFavoriteWineState = async (req: TokenRequest, res: Response) => {
        const wineId = req.params.wineId;
        const userId = req.token._id.toString();

        const result = await this.userRepository.getFavoriteWine(wineId, userId);
        let isFavorite: boolean = false
        if (result != null) {
            isFavorite = true
        }

        return res.send(isFavorite);
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

    getFollowedCatalogueState = async (req: TokenRequest, res: Response) => {
        const catalogueId = req.params.catalogueId;
        const userId = req.token._id.toString();

        const result = await this.userRepository.getFollowedCatalogue(catalogueId, userId);
        let isFollowed: boolean = false
        if (result != null) {
            isFollowed = true
        }

        return res.send(isFollowed);
    }

    changeFollowedCatalogueState = async (req: TokenRequest, res: Response) => {
        const catalogueId = req.params.catalogueId;
        const userId = req.token._id.toString();
        const follow: boolean = req.body.follow;

        const result = await this.userRepository.getFollowedCatalogue(catalogueId, userId)

        if (follow && !result) {
            this.userRepository.followCatalogue(catalogueId, userId);
            return res.send("Catalogue is now followed");
        }
        else if (!follow && result) {
            this.userRepository.unfollowCatalogue(result.id);
            return res.send("Catalogue removed from followed");
        } else {
            throw new ResponseError("Error occured while performing follow catalogue request");
        }
    }
}