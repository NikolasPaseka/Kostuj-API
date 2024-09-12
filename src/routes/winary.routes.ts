import { Router } from "express";
import { WinaryController } from "../controllers/WinaryController";
import catchAsync from "../utils/catchAsync";
import { auth } from "../middleware/auth";
import { getMulterUpload } from "../middleware/multer";

const wineryRouter = Router();
const winaryController = new WinaryController();

wineryRouter.route('/')
    .get(catchAsync(winaryController.getWinaries))

wineryRouter.route('/byAdmin')
    .get(auth, catchAsync(winaryController.getWineriesByAdmin))

wineryRouter.route("/:id")
    .get(catchAsync(winaryController.getWineryDetail))

wineryRouter.route("/:id/image")
    .post(auth, getMulterUpload("wineryImage"), catchAsync(winaryController.uploadWineryImage))
    .delete(auth, catchAsync(winaryController.deleteWineryImage))

export default wineryRouter;