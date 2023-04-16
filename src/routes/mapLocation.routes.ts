import { Router } from "express";
import catchAsync from "../utils/catchAsync";
import { auth } from "../middleware/auth";
import { MapLocationController } from "../controllers/MapLocationController";

const mapLocationRouter = Router();
const mapLocationController = new MapLocationController();

mapLocationRouter.route('/')
    .get(catchAsync(mapLocationController.getAllLocations))


export default mapLocationRouter;