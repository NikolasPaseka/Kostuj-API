"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var WinaryController_1 = require("../controllers/WinaryController");
var catchAsync_1 = __importDefault(require("../utils/catchAsync"));
var wineryRouter = (0, express_1.Router)();
var winaryController = new WinaryController_1.WinaryController();
wineryRouter.route('/')
    .get((0, catchAsync_1.default)(winaryController.getWinaries));
wineryRouter.route("/:id")
    .get((0, catchAsync_1.default)(winaryController.getWineryDetail));
exports.default = wineryRouter;
