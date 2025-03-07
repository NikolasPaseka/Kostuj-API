import { Router } from "express";
import { UserController } from "../controllers/UserController";

import catchAsync from "../utils/catchAsync";
import { auth, authSuperAdmin } from "../middleware/auth";
import { multerUpload } from "../middleware/multer";

const userRouter = Router();
const userController = new UserController();

userRouter.route("/")
    .get(auth, catchAsync(userController.getUsers))

userRouter.route("/login")
    .post(catchAsync(userController.login))

userRouter.route("/login/google")
    .post(catchAsync(userController.loginGoogle))

userRouter.route("/register")
    .post(catchAsync(userController.register))

userRouter.route("/refreshToken")
    .post(catchAsync(userController.refreshToken))

userRouter.route("/logout")
    .post(auth, catchAsync(userController.logout))

userRouter.route("/edit")
    .patch(auth, catchAsync(userController.editUser))

userRouter.route("/edit/avatar")
    .patch(auth, multerUpload, catchAsync(userController.editUserAvatar))

userRouter.route("/delete")
    .post(auth, catchAsync(userController.deleteUser))

userRouter.route("/commissionCatalogues")
    .get(auth, catchAsync(userController.getCommissionCatalogues))

userRouter.route("/administrationSettings")
    .get(auth, catchAsync(userController.getAdministrationSettings))
    .put(auth, catchAsync(userController.updateAdministrationSettings))

userRouter.route("/:id")
    .get(auth, catchAsync(userController.getUserById))

//TODO DELETE
userRouter.route("/resetPassword")
    .post(authSuperAdmin, catchAsync(userController.resetPassowrd))

userRouter.route("/:id/authorizations")
    .put(authSuperAdmin, catchAsync(userController.updateUserAuthorizations))

userRouter.route("/commissionCatalogues/ratedSamples/:catalogueId")
    .get(auth, catchAsync(userController.getRatedSamples))
    .post(auth, catchAsync(userController.addRatedSample))
    .put(auth, catchAsync(userController.updateRatedSample))

userRouter.route("/tastedSamples/:catalogueId")
    .get(auth, catchAsync(userController.getTastedSamples))
    .post(auth, catchAsync(userController.updateTastedSamples))
    .delete(auth, catchAsync(userController.deleteTastedSamples))

export default userRouter;