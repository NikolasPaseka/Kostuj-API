"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const MapLocationController_1 = require("../controllers/MapLocationController");
const mapLocationRouter = (0, express_1.Router)();
const mapLocationController = new MapLocationController_1.MapLocationController();
mapLocationRouter.route('/')
    .get((0, catchAsync_1.default)(mapLocationController.getAllLocations));
exports.default = mapLocationRouter;