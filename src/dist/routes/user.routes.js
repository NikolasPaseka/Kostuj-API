"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UserController_1 = require("../controllers/UserController");
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const auth_1 = require("../middleware/auth");
const userRouter = (0, express_1.Router)();
const userController = new UserController_1.UserController();
userRouter.route("/login")
    .post((0, catchAsync_1.default)(userController.login));
userRouter.route("/register")
    .post((0, catchAsync_1.default)(userController.register));
userRouter.route("/delete")
    .post(auth_1.auth, (0, catchAsync_1.default)(userController.deleteUser));
userRouter.route("/commissionCatalogues")
    .get(auth_1.auth, (0, catchAsync_1.default)(userController.getCommissionCatalogues));
userRouter.route("/:id")
    .get(auth_1.auth, (0, catchAsync_1.default)(userController.getUserById));
userRouter.route("/commissionCatalogues/ratedSamples/:catalogueId")
    .get(auth_1.auth, (0, catchAsync_1.default)(userController.getRatedSamples))
    .post(auth_1.auth, (0, catchAsync_1.default)(userController.addRatedSample))
    .put(auth_1.auth, (0, catchAsync_1.default)(userController.updateRatedSample));
userRouter.route("/tastedSamples/:catalogueId")
    .get(auth_1.auth, (0, catchAsync_1.default)(userController.getTastedSamples))
    .post(auth_1.auth, (0, catchAsync_1.default)(userController.updateTastedSamples))
    .delete(auth_1.auth, (0, catchAsync_1.default)(userController.deleteTastedSamples));
exports.default = userRouter;
