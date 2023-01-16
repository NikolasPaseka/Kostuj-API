"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const WineController_1 = require("../controllers/WineController");
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
function getWineRouter() {
    const router = (0, express_1.Router)();
    const wineController = new WineController_1.WineController();
    router.route("/")
        .get((0, catchAsync_1.default)(wineController.getWines));
    router.route("/grapeVarietals")
        .get((0, catchAsync_1.default)(wineController.getGrapeVarietals));
    router.route("/:id")
        .get((0, catchAsync_1.default)(wineController.getWineDetail));
    return router;
}
exports.default = getWineRouter;
