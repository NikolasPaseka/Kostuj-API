import { Router } from "express";
import { WinaryController } from "../controllers/WinaryController";
import { WineController } from "../controllers/WineController";
import catchAsync from "../utils/catchAsync";

const wineRouter = Router();
const wineController = new WineController();

wineRouter.route("/")
    .get(catchAsync(wineController.getWines))

wineRouter.route("/grapeVarietals")
    .get(catchAsync(wineController.getGrapeVarietals))

wineRouter.route("/:id")
    .get(catchAsync(wineController.getWineDetail))

export default wineRouter;