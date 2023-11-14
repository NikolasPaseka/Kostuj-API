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
exports.UserController = void 0;
var bcrypt_1 = __importDefault(require("bcrypt"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var auth_1 = require("../middleware/auth");
var UserRepository_1 = require("../repositories/UserRepository");
var ResponseError_1 = require("../utils/ResponseError");
var CatalogueRepository_1 = require("../repositories/CatalogueRepository");
var UserController = /** @class */ (function () {
    function UserController() {
        var _this = this;
        this.userRepository = new UserRepository_1.UserRepository();
        this.catalogueRepository = new CatalogueRepository_1.CatalogueRepository();
        this.getUserById = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var id, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = req.params.id;
                        return [4 /*yield*/, this.userRepository.getUserById(id)];
                    case 1:
                        user = _a.sent();
                        res.json(user);
                        return [2 /*return*/];
                }
            });
        }); };
        this.register = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = req.body;
                        return [4 /*yield*/, this.userRepository.createUser(user)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.login(req, res)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        }); };
        this.login = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var _a, email, password, foundUser, isMatch, token;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = req.body, email = _a.email, password = _a.password;
                        return [4 /*yield*/, this.userRepository.getUserByEmail(email)];
                    case 1:
                        foundUser = _c.sent();
                        isMatch = bcrypt_1.default.compareSync(password, foundUser.password);
                        if (isMatch) {
                            token = jsonwebtoken_1.default.sign({ _id: (_b = foundUser._id) === null || _b === void 0 ? void 0 : _b.toString(), email: foundUser.email }, auth_1.SECRET_KEY, {});
                            return [2 /*return*/, res.json({
                                    id: foundUser._id,
                                    email: foundUser.email,
                                    token: token
                                })];
                        }
                        else {
                            throw new ResponseError_1.ResponseError("Incorrect credentials");
                        }
                        return [2 /*return*/];
                }
            });
        }); };
        this.getCommissionCatalogues = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var userId, commissionCatalogues, result, _i, commissionCatalogues_1, catalogue, ratedSamples, samples;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userId = req.token._id.toString();
                        return [4 /*yield*/, this.userRepository.getCommissionCatalogues(userId)];
                    case 1:
                        commissionCatalogues = _a.sent();
                        result = [];
                        _i = 0, commissionCatalogues_1 = commissionCatalogues;
                        _a.label = 2;
                    case 2:
                        if (!(_i < commissionCatalogues_1.length)) return [3 /*break*/, 6];
                        catalogue = commissionCatalogues_1[_i];
                        return [4 /*yield*/, this.userRepository.getRatedSamples(userId, catalogue.id)];
                    case 3:
                        ratedSamples = _a.sent();
                        return [4 /*yield*/, this.catalogueRepository.getCatalogueSamples(catalogue.id)];
                    case 4:
                        samples = _a.sent();
                        result.push({
                            id: catalogue.id,
                            title: catalogue.title,
                            startDate: catalogue.startDate,
                            imageUrl: catalogue.imageUrl,
                            numberOfRated: ratedSamples.length,
                            numberOfSamples: samples.length
                        });
                        _a.label = 5;
                    case 5:
                        _i++;
                        return [3 /*break*/, 2];
                    case 6: return [2 /*return*/, res.json(result)];
                }
            });
        }); };
        this.getRatedSamples = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var userId, catalogueId, result, ratedSamples, _i, ratedSamples_1, ratedSample;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userId = req.token._id.toString();
                        catalogueId = req.params.catalogueId;
                        result = [];
                        return [4 /*yield*/, this.userRepository.getRatedSamples(userId, catalogueId)];
                    case 1:
                        ratedSamples = _a.sent();
                        for (_i = 0, ratedSamples_1 = ratedSamples; _i < ratedSamples_1.length; _i++) {
                            ratedSample = ratedSamples_1[_i];
                            result.push({
                                id: ratedSample.id,
                                commissionMemberId: ratedSample.commissionMemberId,
                                sampleId: ratedSample.sampleId,
                                rating: ratedSample.rating
                            });
                        }
                        return [2 /*return*/, res.json(result)];
                }
            });
        }); };
        this.addRatedSample = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var userId, sampleId, rating, ratedSample;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userId = req.token._id.toString();
                        sampleId = req.body.sampleId;
                        rating = req.body.rating;
                        return [4 /*yield*/, this.userRepository.addRatedSample(userId, sampleId, rating, false)];
                    case 1:
                        ratedSample = _a.sent();
                        res.json(ratedSample);
                        return [2 /*return*/];
                }
            });
        }); };
        this.updateRatedSample = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var userId, sampleId, rating, ratedSample;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userId = req.token._id.toString();
                        sampleId = req.body.sampleId;
                        rating = req.body.rating;
                        return [4 /*yield*/, this.userRepository.addRatedSample(userId, sampleId, rating, true)];
                    case 1:
                        ratedSample = _a.sent();
                        res.json(ratedSample);
                        return [2 /*return*/];
                }
            });
        }); };
        this.getTastedSamples = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var userId, catalogueId, tastedSamples;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userId = req.token._id.toString();
                        catalogueId = req.params.catalogueId;
                        return [4 /*yield*/, this.userRepository.getTastedSamples(catalogueId, userId)];
                    case 1:
                        tastedSamples = _a.sent();
                        res.json(tastedSamples);
                        return [2 /*return*/];
                }
            });
        }); };
        this.updateTastedSamples = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var userId, tastedSamples;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userId = req.token._id.toString();
                        tastedSamples = req.body;
                        return [4 /*yield*/, this.userRepository.updateTastedSamples(tastedSamples, userId)];
                    case 1:
                        _a.sent();
                        res.json("Successfuly updated");
                        return [2 /*return*/];
                }
            });
        }); };
        this.deleteTastedSamples = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var userId, tastedSamples;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userId = req.token._id.toString();
                        tastedSamples = req.body;
                        return [4 /*yield*/, this.userRepository.deleteTastedSamples(tastedSamples, userId)];
                    case 1:
                        _a.sent();
                        res.json("Successfuly deleted");
                        return [2 /*return*/];
                }
            });
        }); };
    }
    return UserController;
}());
exports.UserController = UserController;
