"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CatalogueController = void 0;
const CatalogueRepository_1 = require("../repositories/CatalogueRepository");
const ResponseError_1 = require("../utils/ResponseError");
class CatalogueController {
    constructor() {
        this.catalogueRepository = new CatalogueRepository_1.CatalogueRepository();
        this.getCatalogues = async (req, res) => {
            let page = parseInt(req.query.page);
            let limit = parseInt(req.query.limit);
            if (Number.isNaN(page) || Number.isNaN(limit)) {
                throw new ResponseError_1.ResponseError("Invalid page or limit query");
            }
            const catalogues = await this.catalogueRepository.getCatalogues(page, limit);
            res.json(catalogues);
        };
        this.getCatalogueBySearch = async (req, res) => {
            const title = req.query.title;
            const catalogues = await this.catalogueRepository.getCatalogueByTitle(title);
            res.json(catalogues);
        };
        this.getCatalogueDetail = async (req, res) => {
            const { id } = req.params;
            const catalogue = await this.catalogueRepository.getCatalogueDetail(id);
            res.json(catalogue);
        };
        this.getCatalogueSamples = async (req, res) => {
            const { id } = req.params;
            const samples = await this.catalogueRepository.getCatalogueSamples(id);
            res.json(samples);
        };
        this.getCatalogueSampleDetail = async (req, res) => {
            const { id } = req.params;
            const sample = await this.catalogueRepository.getCatalogueSampleDetail(id);
            res.json(sample);
        };
        this.getParticipatedWineries = async (req, res) => {
            const { id } = req.params;
            const wineries = await this.catalogueRepository.getParticipatedWineries(id);
            res.json(wineries);
        };
    }
}
exports.CatalogueController = CatalogueController;
