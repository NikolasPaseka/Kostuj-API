import { Router } from "express";
import catchAsync from "../utils/catchAsync";
import { auth } from "../middleware/auth";
import { MapLocationController } from "../controllers/MapLocationController";

function getMapLocationRouter(): Router {
    const router = Router();
    const mapLocationController = new MapLocationController();

    router.route('/')
        .get(catchAsync(mapLocationController.getAllLocations))

    return router;
}

export default getMapLocationRouter;