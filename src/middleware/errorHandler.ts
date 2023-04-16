import { ErrorRequestHandler, Request, Response, NextFunction } from "express"
import { ResponseError } from "../utils/ResponseError"

export const errorHandler: ErrorRequestHandler = (err: ResponseError, req: Request, res: Response, next: NextFunction) => {
    console.log( `error ${err.message}`);
    next();
    const statusCode = err.statusCode || 400;
    
    res.statusCode = statusCode;
    res.json({
      "error": err.message
    })
}