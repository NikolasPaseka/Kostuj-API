import { Router } from "express";
import { WinaryController } from "../controllers/WinaryController";
import catchAsync from "../utils/catchAsync";

const wineryRouter = Router();
const winaryController = new WinaryController();

wineryRouter.route('/')
    .get(catchAsync(winaryController.getWinaries))

wineryRouter.route("/:id")
    .get(catchAsync(winaryController.getWineryDetail))

export default wineryRouter;