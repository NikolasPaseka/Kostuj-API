"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CatalogueController = void 0;
const wine_1 = require("../models/wine");
const CatalogueRepository_1 = require("../repositories/CatalogueRepository");
class CatalogueController {
    constructor() {
        this.catalogueRepository = new CatalogueRepository_1.CatalogueRepository();
        this.getCatalogues = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const page = parseInt(req.query.page);
            const limit = parseInt(req.query.limit);
            const catalogues = yield this.catalogueRepository.getCatalogues(page, limit);
            res.json(catalogues);
        });
        this.getCatalogueDetail = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const catalogue = yield this.catalogueRepository.getCatalogueDetail(id);
            res.json(catalogue);
        });
        this.getCatalogueSamples = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const samples = yield this.catalogueRepository.getCatalogueSamples(id);
            res.json(samples);
        });
        this.getCatalogueSampleDetail = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const sample = yield this.catalogueRepository.getCatalogueSampleDetail(id);
            res.json(sample);
        });
        this.getSampleCountsByColor = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { id } = req.params;
            const samples = yield this.catalogueRepository.getCatalogueSamples(id);
            let countsMap = new Map([
                ["red", 0],
                ["white", 0],
                ["rose", 0]
            ]);
            for (const sample of samples) {
                if (sample.wineId instanceof wine_1.Wine) {
                    const color = sample.wineId.color;
                    countsMap.set(color, ((_a = countsMap.get(color)) !== null && _a !== void 0 ? _a : 0) + 1);
                }
            }
            const countsObject = Object.fromEntries(countsMap);
            res.json(countsObject);
        });
        this.getParticipatedWineries = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const wineries = yield this.catalogueRepository.getParticipatedWineries(id);
            res.json(wineries);
        });
    }
}
exports.CatalogueController = CatalogueController;
