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
const CatalogueRepository_1 = require("../repositories/CatalogueRepository");
const ResponseError_1 = require("../utils/ResponseError");
class CatalogueController {
    constructor() {
        this.catalogueRepository = new CatalogueRepository_1.CatalogueRepository();
        this.getCatalogues = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let page = parseInt(req.query.page);
            let limit = parseInt(req.query.limit);
            if (Number.isNaN(page) || Number.isNaN(limit)) {
                throw new ResponseError_1.ResponseError("Invalid page or limit query");
            }
            const catalogues = yield this.catalogueRepository.getCatalogues(page, limit);
            res.json(catalogues);
        });
        this.getCatalogueBySearch = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const title = req.query.title;
            const catalogues = yield this.catalogueRepository.getCatalogueByTitle(title);
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
        this.getParticipatedWineries = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const wineries = yield this.catalogueRepository.getParticipatedWineries(id);
            res.json(wineries);
        });
    }
}
exports.CatalogueController = CatalogueController;
