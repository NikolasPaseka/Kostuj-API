"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var WineController_1 = require("../controllers/WineController");
var catchAsync_1 = __importDefault(require("../utils/catchAsync"));
var wineRouter = (0, express_1.Router)();
var wineController = new WineController_1.WineController();
wineRouter.route("/")
    .get((0, catchAsync_1.default)(wineController.getWines));
wineRouter.route("/grapeVarietals")
    .get((0, catchAsync_1.default)(wineController.getGrapeVarietals));
wineRouter.route("/:id")
    .get((0, catchAsync_1.default)(wineController.getWineDetail));
exports.default = wineRouter;
