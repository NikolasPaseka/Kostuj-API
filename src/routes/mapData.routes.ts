import { Router } from "express";
import catchAsync from "../utils/catchAsync";
import { MapDataController } from "../controllers/MapDataController";
import { auth } from "../middleware/auth";

const mapDataRouter = Router();
const mapController = new MapDataController();

mapDataRouter.route("/:id")
    .get(catchAsync(mapController.getCatalogueMapData))
    .post(auth, catchAsync(mapController.createCatalogueMapData))

export default mapDataRouter;