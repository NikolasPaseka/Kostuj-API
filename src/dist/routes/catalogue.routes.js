"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const CatalogueController_1 = require("../controllers/CatalogueController");
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const catalogueRouter = (0, express_1.Router)();
const catalogueController = new CatalogueController_1.CatalogueController();
catalogueRouter.route("/")
    .get((0, catchAsync_1.default)(catalogueController.getCatalogues));
catalogueRouter.route("/search")
    .get((0, catchAsync_1.default)(catalogueController.getCatalogueBySearch));
catalogueRouter.route("/:id")
    .get((0, catchAsync_1.default)(catalogueController.getCatalogueDetail));
catalogueRouter.route("/:id/samples")
    .get((0, catchAsync_1.default)(catalogueController.getCatalogueSamples));
catalogueRouter.route("/:id/wineries")
    .get((0, catchAsync_1.default)(catalogueController.getParticipatedWineries));
catalogueRouter.route("/samples/:id")
    .get((0, catchAsync_1.default)(catalogueController.getCatalogueSampleDetail));
exports.default = catalogueRouter;
