import { Router } from "express";
import { CatalogueController } from "../controllers/CatalogueController";
import catchAsync from "../utils/catchAsync";

const catalogueRouter = Router();
const catalogueController = new CatalogueController();

catalogueRouter.route("/")
    .get(catchAsync(catalogueController.getCatalogues))

catalogueRouter.route("/search")
    .get(catchAsync(catalogueController.getCatalogueBySearch))

catalogueRouter.route("/:id")
    .get(catchAsync(catalogueController.getCatalogueDetail))

catalogueRouter.route("/:id/samples")
    .get(catchAsync(catalogueController.getCatalogueSamples))

catalogueRouter.route("/:id/wineries")
    .get(catchAsync(catalogueController.getParticipatedWineries))

catalogueRouter.route("/samples/:id")
    .get(catchAsync(catalogueController.getCatalogueSampleDetail))


export default catalogueRouter;