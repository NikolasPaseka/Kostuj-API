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
exports.UserRepository = void 0;
var catalogue_1 = require("../models/catalogue");
var commissionMember_1 = require("../models/commissionMember");
var ratedSample_1 = require("../models/ratedSample");
var sample_1 = require("../models/sample");
var tastedSample_1 = require("../models/tastedSample");
var user_1 = require("../models/user");
var ResponseError_1 = require("../utils/ResponseError");
var UserRepository = /** @class */ (function () {
    function UserRepository() {
        var _this = this;
        this.getCommissionCatalogues = function (userId) { return __awaiter(_this, void 0, void 0, function () {
            var commissionCatalogues, ids;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, commissionMember_1.CommissionMember.find({ userId: userId }).select("catalogueId")];
                    case 1:
                        commissionCatalogues = _a.sent();
                        ids = [];
                        commissionCatalogues.map(function (element) { ids.push(element.catalogueId.toString()); });
                        return [4 /*yield*/, catalogue_1.Catalogue.find({ published: false }).where("_id").in(ids).exec()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        }); };
        this.getRatedSamples = function (userId, catalogueId) { return __awaiter(_this, void 0, void 0, function () {
            var filteredResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, ratedSample_1.RatedSample
                            .find({
                            commissionMemberId: userId
                        })
                            .populate({
                            path: "sampleId",
                            model: sample_1.Sample,
                            match: { catalogueId: catalogueId }
                        })
                            .exec()];
                    case 1:
                        filteredResult = _a.sent();
                        return [4 /*yield*/, ratedSample_1.RatedSample.find({
                                "_id": { $in: filteredResult.map(function (val) { return val.id; }) }
                            }).exec()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        }); };
        this.addRatedSample = function (commissionMemberId, sampleId, rating, update) { return __awaiter(_this, void 0, void 0, function () {
            var existedRatedSample, updatedSample, ratedSample;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, ratedSample_1.RatedSample.findOne({ commissionMemberId: commissionMemberId, sampleId: sampleId })];
                    case 1:
                        existedRatedSample = _a.sent();
                        if (update && existedRatedSample == null) {
                            throw new ResponseError_1.ResponseError("Sample has not been rated yet");
                        }
                        else if (!update && existedRatedSample != null) {
                            throw new ResponseError_1.ResponseError("Sample already rated by this commission member");
                        }
                        if (!update) return [3 /*break*/, 3];
                        return [4 /*yield*/, ratedSample_1.RatedSample.findOneAndUpdate({
                                commissionMemberId: commissionMemberId,
                                sampleId: sampleId
                            }, {
                                rating: rating
                            }, { new: true })];
                    case 2:
                        updatedSample = _a.sent();
                        return [2 /*return*/, (updatedSample)];
                    case 3:
                        ratedSample = new ratedSample_1.RatedSample({ commissionMemberId: commissionMemberId, sampleId: sampleId, rating: rating });
                        return [4 /*yield*/, ratedSample.save()];
                    case 4:
                        _a.sent();
                        return [2 /*return*/, ratedSample];
                }
            });
        }); };
    }
    UserRepository.prototype.getUserByEmail = function (email) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, user_1.User.findOne({ email: email })];
                    case 1:
                        user = _a.sent();
                        if (user == null) {
                            throw new ResponseError_1.ResponseError("Incorrect credentials", 400);
                        }
                        return [2 /*return*/, user];
                }
            });
        });
    };
    UserRepository.prototype.getUserById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, user_1.User.findById(id)];
                    case 1:
                        user = _a.sent();
                        if (user == null) {
                            throw new ResponseError_1.ResponseError("User does not exist", 404);
                        }
                        return [2 /*return*/, user];
                }
            });
        });
    };
    UserRepository.prototype.createUser = function (userData) {
        return __awaiter(this, void 0, void 0, function () {
            var email, res, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        email = userData.email;
                        return [4 /*yield*/, user_1.User.findOne({ email: email })];
                    case 1:
                        res = _a.sent();
                        if (res) {
                            throw new ResponseError_1.ResponseError("User with this email address already exists");
                        }
                        user = new user_1.User(userData);
                        return [4 /*yield*/, user.save()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    UserRepository.prototype.getTastedSamples = function (catalogueId, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var filteredResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, tastedSample_1.TastedSample.find({
                            userId: userId
                        }).populate({
                            path: "sampleId",
                            model: sample_1.Sample,
                            match: { catalogueId: catalogueId }
                        }).exec()];
                    case 1:
                        filteredResult = _a.sent();
                        return [4 /*yield*/, tastedSample_1.TastedSample.find({
                                "_id": { $in: filteredResult.map(function (val) { return val.id; }) }
                            }).exec()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    UserRepository.prototype.updateTastedSamples = function (tastedSamples, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var _i, tastedSamples_1, tastedSample, foundResult, newTasted;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _i = 0, tastedSamples_1 = tastedSamples;
                        _a.label = 1;
                    case 1:
                        if (!(_i < tastedSamples_1.length)) return [3 /*break*/, 7];
                        tastedSample = tastedSamples_1[_i];
                        return [4 /*yield*/, tastedSample_1.TastedSample.findOne({
                                sampleId: tastedSample.sampleId,
                                userId: userId
                            }).exec()];
                    case 2:
                        foundResult = _a.sent();
                        if (!(foundResult != null)) return [3 /*break*/, 4];
                        // update tasted wine
                        return [4 /*yield*/, tastedSample_1.TastedSample.findOneAndUpdate({
                                sampleId: tastedSample.sampleId,
                                userId: userId,
                                modifiedAt: { $lt: tastedSample.modifiedAt }
                            }, {
                                rating: tastedSample.rating,
                                note: tastedSample.note,
                                modifiedAt: tastedSample.modifiedAt
                            }).exec()];
                    case 3:
                        // update tasted wine
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 4:
                        newTasted = new tastedSample_1.TastedSample({
                            sampleId: tastedSample.sampleId,
                            userId: userId,
                            rating: tastedSample.rating,
                            note: tastedSample.note,
                            modifiedAt: tastedSample.modifiedAt
                        });
                        return [4 /*yield*/, newTasted.save()];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6:
                        _i++;
                        return [3 /*break*/, 1];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    UserRepository.prototype.deleteTastedSamples = function (tastedSamples, userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, tastedSample_1.TastedSample.deleteMany({
                            sampleId: { $in: tastedSamples.map(function (val) { return val.sampleId; }) },
                            userId: userId
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return UserRepository;
}());
exports.UserRepository = UserRepository;
