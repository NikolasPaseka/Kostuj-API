import { NextFunction, Request, Response } from "express";

function catchAsync(func: Function) {
    return (req: Request, res: Response, next: NextFunction) => {
        func(req, res, next).catch(next);
    }
}

export default catchAsync;