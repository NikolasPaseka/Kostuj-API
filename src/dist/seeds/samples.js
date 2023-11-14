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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mocker_data_generator_1 = __importDefault(require("mocker-data-generator"));
var sample_1 = require("../models/sample");
var catalogue_1 = require("../models/catalogue");
var wine_1 = require("../models/wine");
function seedSamples() {
    return __awaiter(this, void 0, void 0, function () {
        function seedData() {
            return __awaiter(this, void 0, void 0, function () {
                var catalogues, wines, catalogueIndex, wineIndex, _i, _a, sample, samp, e_1;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, catalogue_1.Catalogue.find({})];
                        case 1:
                            catalogues = _b.sent();
                            return [4 /*yield*/, wine_1.Wine.find({})];
                        case 2:
                            wines = _b.sent();
                            catalogueIndex = 0;
                            wineIndex = 0;
                            for (_i = 0, _a = data.sampleMock; _i < _a.length; _i++) {
                                sample = _a[_i];
                                sample.catalogueId = catalogues[catalogueIndex];
                                sample.wineId = wines[wineIndex];
                                samp = new sample_1.Sample(sample);
                                samp.save();
                                if (catalogueIndex >= catalogues.length - 1) {
                                    catalogueIndex = 0;
                                }
                                else {
                                    catalogueIndex++;
                                }
                                if (wineIndex >= wines.length - 1) {
                                    wineIndex = 0;
                                }
                                else {
                                    wineIndex++;
                                }
                            }
                            return [3 /*break*/, 4];
                        case 3:
                            e_1 = _b.sent();
                            console.log(e_1);
                            return [3 /*break*/, 4];
                        case 4:
                            console.log("done");
                            return [2 /*return*/];
                    }
                });
            });
        }
        var sampleMock, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sampleMock = {
                        name: { faker: "lorem.words(1)" },
                        rating: { function: function () {
                                return Math.floor(Math.random() * (20 - 5 + 1) + 5); //ranomd from 5 to 20
                            } }
                    };
                    data = (0, mocker_data_generator_1.default)()
                        .schema('sampleMock', sampleMock, 1200)
                        .buildSync();
                    return [4 /*yield*/, seedData()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.default = seedSamples;
