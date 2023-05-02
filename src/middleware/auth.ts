import jwt, { Secret } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { ObjectId } from 'mongoose';

//TODO - predelat secret
export const SECRET_KEY: Secret = 'tohle-je-muj-secret';

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

        const decoded = jwt.verify(token, SECRET_KEY);
        (req as TokenRequest).token = decoded as IToken;

        next();
    } catch (err) {
        res.status(401).send('Please authenticate');
    }
}