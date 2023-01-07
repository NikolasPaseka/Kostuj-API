import { Router } from "express";
import { CatalogueController } from "../controllers/CatalogueController";
import catchAsync from "../utils/catchAsync";
import { auth } from "../middleware/auth";

function getCatalogueRouter(): Router {
    const router = Router();
    const catalogueController = new CatalogueController();

    router.route("/")
        .get(catchAsync(catalogueController.getCatalogues))

    router.route("/:id")
        .get(catchAsync(catalogueController.getCatalogueDetail))

    router.route("/:id/samples")
        .get(catchAsync(catalogueController.getCatalogueSamples))

    router.route("/:id/numbersOfSamples")
        .get(catchAsync(catalogueController.getSampleCountsByColor))

    router.route("/samples/:id")
        .get(catchAsync(catalogueController.getCatalogueSampleDetail))

    return router;
}

export default getCatalogueRouter;