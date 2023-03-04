"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const CatalogueController_1 = require("../controllers/CatalogueController");
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
function getCatalogueRouter() {
    const router = (0, express_1.Router)();
    const catalogueController = new CatalogueController_1.CatalogueController();
    router.route("/")
        .get((0, catchAsync_1.default)(catalogueController.getCatalogues));
    router.route("/search")
        .get((0, catchAsync_1.default)(catalogueController.getCatalogueBySearch));
    router.route("/:id")
        .get((0, catchAsync_1.default)(catalogueController.getCatalogueDetail));
    router.route("/:id/samples")
        .get((0, catchAsync_1.default)(catalogueController.getCatalogueSamples));
    router.route("/:id/numbersOfSamples")
        .get((0, catchAsync_1.default)(catalogueController.getSampleCountsByColor));
    router.route("/:id/wineries")
        .get((0, catchAsync_1.default)(catalogueController.getParticipatedWineries));
    router.route("/samples/:id")
        .get((0, catchAsync_1.default)(catalogueController.getCatalogueSampleDetail));
    return router;
}
exports.default = getCatalogueRouter;
