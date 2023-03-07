"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UserController_1 = require("../controllers/UserController");
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const auth_1 = require("../middleware/auth");
function getUserRouter() {
    const router = (0, express_1.Router)();
    const userController = new UserController_1.UserController();
    router.route("/")
        .get((0, catchAsync_1.default)(userController.getUsers));
    router.route("/login")
        .post((0, catchAsync_1.default)(userController.login));
    router.route("/register")
        .post((0, catchAsync_1.default)(userController.register));
    router.route("/favoriteWines")
        .get(auth_1.auth, (0, catchAsync_1.default)(userController.getFavoriteWines));
    router.route("/commissionCatalogues")
        .get(auth_1.auth, (0, catchAsync_1.default)(userController.getCommissionCatalogues));
    router.route("/:id")
        .get(auth_1.auth, (0, catchAsync_1.default)(userController.getUserById));
    router.route("/commissionCatalogues/ratedSamples/:catalogueId")
        .get(auth_1.auth, (0, catchAsync_1.default)(userController.getRatedSamples));
    router.route("/favoriteWine/:wineId")
        .get(auth_1.auth, (0, catchAsync_1.default)(userController.getFavoriteWineState))
        .post(auth_1.auth, (0, catchAsync_1.default)(userController.changeFavoriteWineState))
        .put(auth_1.auth, (0, catchAsync_1.default)(userController.updateFavoriteWineNotes));
    return router;
}
exports.default = getUserRouter;
