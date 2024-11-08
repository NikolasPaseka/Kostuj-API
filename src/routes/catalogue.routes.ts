import { Router } from "express";
import { CatalogueController } from "../controllers/CatalogueController";
import catchAsync from "../utils/catchAsync";
import { auth } from "../middleware/auth";
import { getMulterUpload } from "../middleware/multer";
import { get } from "http";

const catalogueRouter = Router();
const catalogueController = new CatalogueController();

catalogueRouter.route("/")
    .get(catchAsync(catalogueController.getCatalogues))
    .post(auth, catchAsync(catalogueController.createCatalogue))

catalogueRouter.route("/search")
    .get(catchAsync(catalogueController.getCatalogueBySearch))

catalogueRouter.route("/byAdmin")
    .get(auth, catchAsync(catalogueController.getCataloguesByAdmin))

catalogueRouter.route("/:id")
    .get(catchAsync(catalogueController.getCatalogueDetail))
    .put(auth, catchAsync(catalogueController.updateCatalogue))
    .delete(auth, catchAsync(catalogueController.deleteCatalogue))

catalogueRouter.route("/:id/publish")
    .post(auth, catchAsync(catalogueController.changePublishState))

// ADD new route for download
catalogueRouter.route("/:id/samples")
    .get(catchAsync(catalogueController.getCatalogueSamples))

catalogueRouter.route("/:id/wineries")
    .get(catchAsync(catalogueController.getParticipatedWineries))
    .post(auth, catchAsync(catalogueController.addParticipatedWinery))
    .delete(auth, catchAsync(catalogueController.removeParticipatedWinery))

catalogueRouter.route("/:id/importContentData")
    .post(auth, catchAsync(catalogueController.importContentData))

catalogueRouter.route("/:id/autoLabelSamples")
    .get(catchAsync(catalogueController.autoLabelSamples))

catalogueRouter.route("/:id/images")
    .post(auth, getMulterUpload("catalogueImages", true), catchAsync(catalogueController.uploadCatalogueImages))
    .delete(auth, catchAsync(catalogueController.deleteCatalogueImage))

catalogueRouter.route("/samples/:id")
    .get(catchAsync(catalogueController.getCatalogueSampleDetail))
    .delete(auth, catchAsync(catalogueController.deleteCatalogueSample))


export default catalogueRouter;