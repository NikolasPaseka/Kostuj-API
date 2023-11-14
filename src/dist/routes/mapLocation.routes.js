"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var catchAsync_1 = __importDefault(require("../utils/catchAsync"));
var MapLocationController_1 = require("../controllers/MapLocationController");
var mapLocationRouter = (0, express_1.Router)();
var mapLocationController = new MapLocationController_1.MapLocationController();
mapLocationRouter.route('/')
    .get((0, catchAsync_1.default)(mapLocationController.getAllLocations));
exports.default = mapLocationRouter;
