import { Router } from "express";
import { UserController } from "../controllers/UserController";

import catchAsync from "../utils/catchAsync";
import { auth } from "../middleware/auth";

function getUserRouter(): Router {
    const router = Router();
    const userController = new UserController();

    router.route('/')
        .get(catchAsync(userController.getUsers))

    router.route('/login')
        .post(catchAsync(userController.login))

    router.route('/register')
        .post(catchAsync(userController.register))

    router.route('/favoriteWine/:wineId')
        .get(auth, catchAsync(userController.getFavoriteWineState))
        .post(auth, catchAsync(userController.changeFavoriteWineState))

    router.route('/followedCatalogue/:catalogueId')
        .get(auth, catchAsync(userController.getFollowedCatalogueState))
        .post(auth, catchAsync(userController.changeFollowedCatalogueState))

    return router;
}

export default getUserRouter;