import jwt, { Secret } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { ObjectId } from 'mongoose';

import { load } from 'ts-dotenv';
import { ResponseError } from '../utils/ResponseError';

export const authEnv = load({
    ACCESS_TOKEN_SECRET: String,
    REFRESH_TOKEN_SECRET: String
});

interface IToken {
    _id: ObjectId,
    email: string,
    iat: number,
    exp: number
}

export interface TokenRequest extends Request {
    token: IToken
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            throw new Error();
        }

        const decoded = jwt.verify(token, authEnv.ACCESS_TOKEN_SECRET);
        (req as TokenRequest).token = decoded as IToken;

        next();
    } catch (err) {
        const error = new ResponseError("Please authenticate", 401);
        res.status(error.statusCode ?? 400).json(error);
    }
}


export function generateAccessToken(userId: string, email: string): string {
    return jwt.sign({ 
        _id: userId, 
        email: email 
    }, 
    authEnv.ACCESS_TOKEN_SECRET, { 
        expiresIn: '90d'
    });
}

export function generateRefreshToken(userId: string): string {
    return jwt.sign({ 
        _id: userId 
    }, 
    authEnv.REFRESH_TOKEN_SECRET, {
        expiresIn: '90d'
    });
}