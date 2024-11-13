import { Router } from "express";
import { WinaryController } from "../controllers/WinaryController";
import catchAsync from "../utils/catchAsync";
import { auth } from "../middleware/auth";
import { getMulterUpload } from "../middleware/multer";

const wineryRouter = Router();
const winaryController = new WinaryController();

wineryRouter.route('/')
    .get(catchAsync(winaryController.getWinaries))
    .post(auth, catchAsync(winaryController.createWinery))

wineryRouter.route('/byAdmin')
    .get(auth, catchAsync(winaryController.getWineriesByAdmin))

wineryRouter.route("/import")
    .post(auth, catchAsync(winaryController.importWineries))

wineryRouter.route("/:id")
    .get(catchAsync(winaryController.getWineryDetail))
    .delete(auth, catchAsync(winaryController.deleteWinery))
    .put(auth, catchAsync(winaryController.updateWinery))

wineryRouter.route("/:id/image")
    .post(auth, getMulterUpload("wineryImage"), catchAsync(winaryController.uploadWineryImage))
    .delete(auth, catchAsync(winaryController.deleteWineryImage))

export default wineryRouter;