import { Router } from "express";
import { WinaryController } from "../controllers/WinaryController";
import { WineController } from "../controllers/WineController";
import catchAsync from "../utils/catchAsync";
import { auth } from "../middleware/auth";

const wineRouter = Router();
const wineController = new WineController();

wineRouter.route("/")
    .get(catchAsync(wineController.getWines))
    .post(auth, catchAsync(wineController.createWineSample))

wineRouter.route("/samples")
    .put(auth, catchAsync(wineController.updateWineSamples))

wineRouter.route("/grapeVarietals")
    .get(catchAsync(wineController.getGrapeVarietals))

wineRouter.route("/byWinery/:id")
    .get(catchAsync(wineController.getWinesByWinery))

wineRouter.route("/:id")
    .get(catchAsync(wineController.getWineDetail))

export default wineRouter;