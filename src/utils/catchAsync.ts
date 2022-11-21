import { NextFunction, Request, Response } from "express";

function catchAsync(func: Function) {
    return (req: Request, res: Response) => {
        try {
            func(req, res);
        } catch(err) {
            console.log(err);
        }
    }
}

export default catchAsync;