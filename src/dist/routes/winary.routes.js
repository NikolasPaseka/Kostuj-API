"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const WinaryController_1 = require("../controllers/WinaryController");
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
function getWinaryRouter() {
    const router = (0, express_1.Router)();
    const winaryController = new WinaryController_1.WinaryController();
    router.route('/')
        .get((0, catchAsync_1.default)(winaryController.getWinaries));
    router.route("/:id")
        .get((0, catchAsync_1.default)(winaryController.getWineryDetail));
    return router;
}
exports.default = getWinaryRouter;
