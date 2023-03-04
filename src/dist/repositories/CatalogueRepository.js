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
exports.CatalogueRepository = void 0;
const catalogue_1 = require("../models/catalogue");
const GrapeVarietal_1 = require("../models/GrapeVarietal");
const sample_1 = require("../models/sample");
const winary_1 = require("../models/winary");
const wine_1 = require("../models/wine");
const ResponseError_1 = require("../utils/ResponseError");
class CatalogueRepository {
    constructor() {
        this.getAllCatalogues = () => __awaiter(this, void 0, void 0, function* () {
            return yield catalogue_1.Catalogue.find();
        });
        this.getCatalogues = (page, limit) => __awaiter(this, void 0, void 0, function* () {
            const startIndex = (page - 1) * limit;
            return yield catalogue_1.Catalogue.find().limit(limit).skip(startIndex).exec();
        });
        this.getCatalogueByTitle = (title) => __awaiter(this, void 0, void 0, function* () {
            return yield catalogue_1.Catalogue.find({ title: { $regex: title, $options: "i" } });
        });
    }
    onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
    }
    getCatalogueDetail(catalogueId) {
        return __awaiter(this, void 0, void 0, function* () {
            const catalogue = yield catalogue_1.Catalogue.findById(catalogueId);
            if (catalogue == null) {
                throw new ResponseError_1.ResponseError("Catalogue not found", 404);
            }
            return catalogue;
        });
    }
    getCatalogueSamples(catalogueId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield sample_1.Sample.find({
                catalogueId: catalogueId
            })
                .populate({
                path: "wineId",
                model: wine_1.Wine,
                populate: [{
                        path: "winaryId",
                        model: winary_1.Winary
                    }, {
                        path: "grapeVarietals",
                        model: GrapeVarietal_1.GrapeVarietal
                    }]
            });
        });
    }
    getCatalogueSampleDetail(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield sample_1.Sample.findById(id)
                .populate({
                path: "wineId",
                model: wine_1.Wine,
                populate: [{
                        path: "winaryId",
                        model: winary_1.Winary
                    }, {
                        path: "grapeVarietals",
                        model: GrapeVarietal_1.GrapeVarietal
                    }]
            });
        });
    }
    getParticipatedWineries(catalogueId) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO CHANGE na particepated wineries entries
            const samplesResult = yield sample_1.Sample.find({ catalogueId: catalogueId });
            console.log(samplesResult);
            const wineIds = [];
            samplesResult.map(x => { wineIds.push(x.wineId.toString()); });
            const wineResults = yield wine_1.Wine.find().where("_id").in(wineIds);
            let wineriesIds = [];
            wineResults.map(x => { wineriesIds.push(x.winaryId.toString()); });
            wineriesIds = wineriesIds.filter(this.onlyUnique);
            return yield winary_1.Winary.find().where("_id").in(wineriesIds);
        });
    }
}
exports.CatalogueRepository = CatalogueRepository;
