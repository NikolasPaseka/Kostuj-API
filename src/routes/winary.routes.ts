import { Router } from "express";
import { WinaryController } from "../controllers/WinaryController";
import catchAsync from "../utils/catchAsync";
import { auth } from "../middleware/auth";

const wineryRouter = Router();
const winaryController = new WinaryController();

wineryRouter.route('/')
    .get(catchAsync(winaryController.getWinaries))

wineryRouter.route('/byAdmin')
    .get(auth, catchAsync(winaryController.getWineriesByAdmin))

wineryRouter.route("/:id")
    .get(catchAsync(winaryController.getWineryDetail))

export default wineryRouter;