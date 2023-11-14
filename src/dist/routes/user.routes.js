"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var UserController_1 = require("../controllers/UserController");
var catchAsync_1 = __importDefault(require("../utils/catchAsync"));
var auth_1 = require("../middleware/auth");
var userRouter = (0, express_1.Router)();
var userController = new UserController_1.UserController();
userRouter.route("/login")
    .post((0, catchAsync_1.default)(userController.login));
userRouter.route("/register")
    .post((0, catchAsync_1.default)(userController.register));
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
