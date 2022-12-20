import { Request, Response } from "express";
import { IUser, User } from "../models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../middleware/auth";

export class UserController {

    async getUsers(req: Request, res: Response) {
        const users: IUser[] = await User.find({});
        res.status(200).json(users);
    }

    async register(req: Request, res: Response) {
        const { email, password } = req.body;

        const user = new User({ email, password });
        await user.save();
        res.status(200).json();
    }

    async login(req: Request, res: Response) {
        const { email, password } = req.body;
        const foundUser = await User.findOne({ email: email });

        if (!foundUser) {
            throw new Error('Name of user is not correct');
        }
        const isMatch = bcrypt.compareSync(password, foundUser.password);
    
        if (isMatch) {
            const token = jwt.sign({ _id: foundUser._id?.toString(), email: foundUser.email }, SECRET_KEY, {
                expiresIn: '2 days',
            });
         
            //return { user: { _id, name }, token: token };
            return res.status(200).json({
                user: {
                    id: foundUser._id,
                    email: foundUser.email
                },
                token: token
            });
        } else {
            throw new Error('Password is not correct');
        }
    }
}