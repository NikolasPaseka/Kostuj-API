import { Router } from "express";
import { UserController } from "../controllers/UserController";

import catchAsync from "../utils/catchAsync";
import { auth } from "../middleware/auth";

const userRouter = Router();
const userController = new UserController();

userRouter.route("/")
    .get(catchAsync(userController.getUsers))

userRouter.route("/login")
    .post(catchAsync(userController.login))

userRouter.route("/register")
    .post(catchAsync(userController.register))

userRouter.route("/commissionCatalogues")
    .get(auth, catchAsync(userController.getCommissionCatalogues))

userRouter.route("/:id")
    .get(auth, catchAsync(userController.getUserById))

userRouter.route("/commissionCatalogues/ratedSamples/:catalogueId")
    .get(auth, catchAsync(userController.getRatedSamples))
    .post(auth, catchAsync(userController.addRatedSample))
    .put(auth, catchAsync(userController.updateRatedSample))

userRouter.route("/tastedSamples/:catalogueId")
    .get(auth, catchAsync(userController.getTastedSamples))
    .post(auth, catchAsync(userController.updateTastedSamples))
    .delete(auth, catchAsync(userController.deleteTastedSamples))

export default userRouter;