import { Router } from "express";
import { UserController } from "../controllers/UserController";

import catchAsync from "../utils/catchAsync";
import { auth } from "../middleware/auth";

function getUserRouter(): Router {
    const router = Router();
    const userController = new UserController();

    router.route("/")
        .get(catchAsync(userController.getUsers))

    router.route("/login")
        .post(catchAsync(userController.login))

    router.route("/register")
        .post(catchAsync(userController.register))

    router.route("/favoriteWines")
        .get(auth, catchAsync(userController.getFavoriteWines))

    router.route("/commissionCatalogues")
        .get(auth, catchAsync(userController.getCommissionCatalogues))

    router.route("/:id")
        .get(auth, catchAsync(userController.getUserById))

    router.route("/commissionCatalogues/ratedSamples/:catalogueId")
        .get(auth, catchAsync(userController.getRatedSamples))
        .post(auth, catchAsync(userController.addRatedSample))
        .put(auth, catchAsync(userController.updateRatedSample))

    router.route("/tastedSamples/:catalogueId")
        .get(auth, catchAsync(userController.getTastedSamples))
        .post(auth, catchAsync(userController.updateTastedSamples))
        .delete(auth, catchAsync(userController.deleteTastedSamples))

    router.route("/favoriteWine/:wineId")
        .get(auth, catchAsync(userController.getFavoriteWineState))
        .post(auth, catchAsync(userController.changeFavoriteWineState))
        .put(auth, catchAsync(userController.updateFavoriteWineNotes))

    return router;
}

export default getUserRouter;