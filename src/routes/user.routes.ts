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

    router.route("/followedCatalogues")
        .get(auth, catchAsync(userController.getFollowedCatalogues))

    router.route("/favoriteWineries")
        .get(auth, catchAsync(userController.getFavoriteWineries))

    router.route("/:id")
        .get(auth, catchAsync(userController.getUserById))

    router.route("/favoriteWine/:wineId")
        .get(auth, catchAsync(userController.getFavoriteWineState))
        .post(auth, catchAsync(userController.changeFavoriteWineState))
        .put(auth, catchAsync(userController.updateFavoriteWineNotes))

    router.route("/followedCatalogue/upcoming")
        .get(auth, catchAsync(userController.getUpcomingCatalogueEvent))

    router.route("/followedCatalogue/:catalogueId")
        .get(auth, catchAsync(userController.getFollowedCatalogueState))
        .post(auth, catchAsync(userController.changeFollowedCatalogueState))

    router.route("/favoriteWinery/:wineryId")
        .get(auth, catchAsync(userController.getFavoriteWineryState))
        .post(auth, catchAsync(userController.changeFavoriteWineryState))

    return router;
}

export default getUserRouter;