import { Router } from "express";
import { WinaryController } from "../controllers/WinaryController";
import { WineController } from "../controllers/WineController";
import catchAsync from "../utils/catchAsync";

function getWineRouter(): Router {
    const router = Router();
    const wineController = new WineController();

    router.route('/')
        .get(catchAsync(wineController.getWines))

    router.route('/grapeVarietals')
        .get(catchAsync(wineController.getGrapeVarietals))

    return router;
}

export default getWineRouter;