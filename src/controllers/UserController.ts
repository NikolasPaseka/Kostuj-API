import { Request, Response } from "express";
import { IUser, User } from "../models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../middleware/auth";
import { UserRepository } from "../repositories/UserRepository";
import { ResponseError } from "../utils/ResponseError";

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
                user: {
                    id: foundUser._id,
                    email: foundUser.email
                },
                token: token
            });
        } else {
            throw new ResponseError("Incorrect credentials");
        }
    }
}