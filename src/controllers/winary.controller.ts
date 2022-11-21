import { Request, Response } from "express";
import { IWinary, Winary } from "../models/winary";
export class WinaryController {

    async getWinaries(req: Request, res: Response) {
        const winaries: IWinary[] = await Winary.find({});
        res.status(200).json(winaries);
    }
}