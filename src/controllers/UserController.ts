import { Request, Response } from "express";
import { IUser, UserAdministrationSettings } from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { authEnv, generateAccessToken, generateRefreshToken, TokenRequest } from "../middleware/auth";
import { UserRepository } from "../repositories/UserRepository";
import { ResponseError } from "../utils/ResponseError";
import { CatalogueRepository } from "../repositories/CatalogueRepository";
import { ITastedSample } from "../models/TastedSample";
import { UserAuthOption } from "../models/utils/UserAuthOption";
import { ObjectId } from "mongoose";
import { handleImageUpload } from "../utils/handleImageUpload";
import { AuthorizationManager, AuthorizationRoles } from "../models/utils/AuthorizationRoles";

export class UserController {
    private userRepository = new UserRepository();
    private catalogueRepository = new CatalogueRepository();
    private authorizationManager = new AuthorizationManager();

    private sendLoginResponse = (user: IUser, userId: string, res: Response) => {
        const accessToken = generateAccessToken(userId, user.email);
        const refreshToken = generateRefreshToken(userId);
        this.userRepository.addUserRefreshToken(userId, refreshToken);
        return res.json({
            id: userId,
            email: user.email,
            accessToken: accessToken,
            refreshToken: refreshToken,
            authorizations: user.authorizations
        });
    }

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
        if (foundUser == null) {
            throw new ResponseError("Incorrect credentials", 401);
        }

        const isMatch = bcrypt.compareSync(password, foundUser.password);
    
        if (isMatch) {
            this.sendLoginResponse(foundUser, foundUser.id, res);
        } else {
            throw new ResponseError("Incorrect credentials", 401);
        }
    }

    loginGoogle = async (req: Request, res: Response) => {
        const { clientToken, email, firstName, lastName, googleId } = req.body;
        const googleClient = new OAuth2Client();
        try {
            await googleClient.verifyIdToken({
                idToken: clientToken,
                audience: "759292546744-7auna86rat46rcrqbg629adpah82pnh7.apps.googleusercontent.com"
            });
        } catch (err) {
            throw new ResponseError("Incorrect credentials", 401);
        }

        const foundUser = await this.userRepository.getUserByEmail(email);
        if (foundUser != null) {
            if (foundUser.accountOption == UserAuthOption.Google) {
                this.sendLoginResponse(foundUser, foundUser.id, res);
            } else {
                throw new ResponseError("User with this email already exists", 400);
            }
        } 
        else {
            const createdUser = await this.userRepository.createUser({
                email: email,
                password: googleId,
                firstName: firstName,
                lastName: lastName,
                accountOption: UserAuthOption.Google,
                refreshTokens: [],
                createdAt: new Date(),
                updatedAt: new Date(),
                authorizations: [AuthorizationRoles.USER]
            });
            if (createdUser == null) {
                throw new ResponseError("Error creating user", 400);
            }
            this.sendLoginResponse(createdUser, createdUser.id, res)
        }
    }

    refreshToken = async (req: Request, res: Response) => {
        const { email, refreshToken } = req.body;
        if (refreshToken == null || email == null) {
            throw new ResponseError("Invalid Request", 400);
        }

        const foundUser = await this.userRepository.getUserByEmail(email);
        if (foundUser == null) {
            throw new ResponseError("User does not exist", 404);
        }
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

    editUser = async (req: TokenRequest, res: Response) => {
        const userId: ObjectId = req.token._id;
        const userData: IUser = req.body;
        await this.userRepository.editUserData(userId, userData);
        
        const updatedUser = await this.userRepository.getUserById(userId);
        res.json(updatedUser);
    }

    editUserAvatar = async (req: TokenRequest, res: Response) => {
        const userId: ObjectId = req.token._id;
        const avatarImage = req.file;

        if (avatarImage == null) {
            throw new ResponseError("No image provided", 400);
        }
        const imageUrl = await handleImageUpload(userId.toString() + "_avatar", "kostuj_avatar", avatarImage);
        this.userRepository.editUserAvatar(userId, imageUrl);
        res.json(imageUrl);
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

    // Super Admin Part
    getUsers = async (req: TokenRequest, res: Response) => {
        const users = await this.userRepository.getAllUsers();
        res.json(users);
    }

    updateUserAuthorizations = async (req: TokenRequest, res: Response) => {
        const userId = req.params.id;
        let authorizations: AuthorizationRoles[] = req.body;
        for (const auth of authorizations) {
            if (!this.authorizationManager.isValidRole(auth)) {
                throw new ResponseError("Invalid authorization role", 400);
            }
        }
        
        authorizations = this.authorizationManager.prepareAuthorizations(authorizations);
        await this.userRepository.updateUserAuthorizations(userId, authorizations);
        res.json("Successfuly updated");
    }

    // TODO DELETE
    resetPassowrd = async (req: TokenRequest, res: Response) => {
        const { userId, newPassword } = req.body;
        
        await this.userRepository.resetPassword(userId, newPassword);
        res.json("Successfuly reseted");
    }

    // Administration settings
    getAdministrationSettings = async (req: TokenRequest, res: Response) => {
        const userId = req.token._id.toString();

        const settings = await this.userRepository.getAdministrationSettings(userId);
        res.json(settings);
    }

    updateAdministrationSettings = async (req: TokenRequest, res: Response) => {
        const userId = req.token._id.toString();
        const settings = req.body as UserAdministrationSettings;

        await this.userRepository.updateAdministrationSettings(userId, settings);
        res.json("Successfuly updated");
    }
}