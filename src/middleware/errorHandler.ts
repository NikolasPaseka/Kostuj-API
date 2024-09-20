import { ErrorRequestHandler, Request, Response, NextFunction } from "express"
import { ResponseError } from "../utils/ResponseError"

export const errorHandler: ErrorRequestHandler = (err: ResponseError, req: Request, res: Response, next: NextFunction) => {
    console.log(`error ${err.message} stack: ${err.stack}`);
    next();
    const statusCode = err.statusCode || 400;
    
    res.statusCode = statusCode;
    res.json(err)
}