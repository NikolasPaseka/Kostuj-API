import { ErrorRequestHandler, Request, Response, NextFunction } from "express"
import { ResponseError } from "../utils/ResponseError"

export const errorHandler: ErrorRequestHandler = (err: ResponseError, req: Request, res: Response, next: NextFunction) => {
    console.log( `error ${err.message}`);
    const statusCode = err.statusCode || 400;
    
    res.statusMessage = err.message;
    res.statusCode = statusCode;
    res.end();
  }