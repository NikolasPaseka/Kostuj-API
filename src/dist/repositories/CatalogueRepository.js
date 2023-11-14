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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CatalogueRepository = void 0;
var catalogue_1 = require("../models/catalogue");
var grapeVarietal_1 = require("../models/grapeVarietal");
var sample_1 = require("../models/sample");
var winary_1 = require("../models/winary");
var wine_1 = require("../models/wine");
var ResponseError_1 = require("../utils/ResponseError");
var CatalogueRepository = /** @class */ (function () {
    function CatalogueRepository() {
        var _this = this;
        this.getAllCatalogues = function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, catalogue_1.Catalogue.find()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); };
        this.getCatalogues = function (page, limit) { return __awaiter(_this, void 0, void 0, function () {
            var startIndex;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        startIndex = (page - 1) * limit;
                        return [4 /*yield*/, catalogue_1.Catalogue.find().limit(limit).skip(startIndex).exec()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); };
        this.getCatalogueByTitle = function (title) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, catalogue_1.Catalogue.find({ title: { $regex: title, $options: "i" } })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); };
    }
    CatalogueRepository.prototype.onlyUnique = function (value, index, self) {
        return self.indexOf(value) === index;
    };
    CatalogueRepository.prototype.getCatalogueDetail = function (catalogueId) {
        return __awaiter(this, void 0, void 0, function () {
            var catalogue;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, catalogue_1.Catalogue.findById(catalogueId)];
                    case 1:
                        catalogue = _a.sent();
                        if (catalogue == null) {
                            throw new ResponseError_1.ResponseError("Catalogue not found", 404);
                        }
                        return [2 /*return*/, catalogue];
                }
            });
        });
    };
    CatalogueRepository.prototype.getCatalogueSamples = function (catalogueId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, sample_1.Sample.find({
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
                                    model: grapeVarietal_1.GrapeVarietal
                                }]
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    CatalogueRepository.prototype.getCatalogueSampleDetail = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, sample_1.Sample.findById(id)
                            .populate({
                            path: "wineId",
                            model: wine_1.Wine,
                            populate: [{
                                    path: "winaryId",
                                    model: winary_1.Winary
                                }, {
                                    path: "grapeVarietals",
                                    model: grapeVarietal_1.GrapeVarietal
                                }]
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    CatalogueRepository.prototype.getParticipatedWineries = function (catalogueId) {
        return __awaiter(this, void 0, void 0, function () {
            var samplesResult, wineIds, wineResults, wineriesIds;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, sample_1.Sample.find({ catalogueId: catalogueId })];
                    case 1:
                        samplesResult = _a.sent();
                        console.log(samplesResult);
                        wineIds = [];
                        samplesResult.map(function (x) { wineIds.push(x.wineId.toString()); });
                        return [4 /*yield*/, wine_1.Wine.find().where("_id").in(wineIds)];
                    case 2:
                        wineResults = _a.sent();
                        wineriesIds = [];
                        wineResults.map(function (x) { wineriesIds.push(x.winaryId.toString()); });
                        wineriesIds = wineriesIds.filter(this.onlyUnique);
                        return [4 /*yield*/, winary_1.Winary.find().where("_id").in(wineriesIds)];
                    case 3: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return CatalogueRepository;
}());
exports.CatalogueRepository = CatalogueRepository;
