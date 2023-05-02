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
exports.UserRepository = void 0;
const catalogue_1 = require("../models/catalogue");
const commissionMember_1 = require("../models/commissionMember");
const ratedSample_1 = require("../models/ratedSample");
const sample_1 = require("../models/sample");
const tastedSample_1 = require("../models/tastedSample");
const user_1 = require("../models/user");
const ResponseError_1 = require("../utils/ResponseError");
class UserRepository {
    constructor() {
        this.getCommissionCatalogues = (userId) => __awaiter(this, void 0, void 0, function* () {
            const commissionCatalogues = yield commissionMember_1.CommissionMember.find({ userId }).select("catalogueId");
            const ids = [];
            commissionCatalogues.map((element) => { ids.push(element.catalogueId.toString()); });
            return yield catalogue_1.Catalogue.find({ published: false }).where("_id").in(ids).exec();
        });
        this.getRatedSamples = (userId, catalogueId) => __awaiter(this, void 0, void 0, function* () {
            const filteredResult = yield ratedSample_1.RatedSample
                .find({
                commissionMemberId: userId
            })
                .populate({
                path: "sampleId",
                model: sample_1.Sample,
                match: { catalogueId }
            })
                .exec();
            return yield ratedSample_1.RatedSample.find({
                "_id": { $in: filteredResult.map(val => { return val.id; }) }
            }).exec();
        });
        this.addRatedSample = (commissionMemberId, sampleId, rating, update) => __awaiter(this, void 0, void 0, function* () {
            const existedRatedSample = yield ratedSample_1.RatedSample.findOne({ commissionMemberId, sampleId });
            if (update && existedRatedSample == null) {
                throw new ResponseError_1.ResponseError("Sample has not been rated yet");
            }
            else if (!update && existedRatedSample != null) {
                throw new ResponseError_1.ResponseError("Sample already rated by this commission member");
            }
            if (update) {
                const updatedSample = yield ratedSample_1.RatedSample.findOneAndUpdate({
                    commissionMemberId, sampleId
                }, {
                    rating
                }, { new: true });
                return (updatedSample);
            }
            const ratedSample = new ratedSample_1.RatedSample({ commissionMemberId, sampleId, rating });
            yield ratedSample.save();
            return ratedSample;
        });
    }
    getUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_1.User.findOne({ email });
            if (user == null) {
                throw new ResponseError_1.ResponseError("Incorrect credentials", 400);
            }
            return user;
        });
    }
    getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_1.User.findById(id);
            if (user == null) {
                throw new ResponseError_1.ResponseError("User does not exist", 404);
            }
            return user;
        });
    }
    createUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            // check if user already exists
            const email = userData.email;
            const res = yield user_1.User.findOne({ email });
            if (res) {
                throw new ResponseError_1.ResponseError("User with this email address already exists");
            }
            const user = new user_1.User(userData);
            yield user.save();
        });
    }
    getTastedSamples(catalogueId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const filteredResult = yield tastedSample_1.TastedSample.find({
                userId
            }).populate({
                path: "sampleId",
                model: sample_1.Sample,
                match: { catalogueId }
            }).exec();
            return yield tastedSample_1.TastedSample.find({
                "_id": { $in: filteredResult.map(val => { return val.id; }) }
            }).exec();
        });
    }
    updateTastedSamples(tastedSamples, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const tastedSample of tastedSamples) {
                const foundResult = yield tastedSample_1.TastedSample.findOne({
                    sampleId: tastedSample.sampleId,
                    userId: userId
                }).exec();
                if (foundResult != null) {
                    // update tasted wine
                    yield tastedSample_1.TastedSample.findOneAndUpdate({
                        sampleId: tastedSample.sampleId,
                        userId: userId,
                        modifiedAt: { $lt: tastedSample.modifiedAt }
                    }, {
                        rating: tastedSample.rating,
                        note: tastedSample.note,
                        modifiedAt: tastedSample.modifiedAt
                    }).exec();
                }
                else {
                    // Add tasted wine to database
                    const newTasted = new tastedSample_1.TastedSample({
                        sampleId: tastedSample.sampleId,
                        userId: userId,
                        rating: tastedSample.rating,
                        note: tastedSample.note,
                        modifiedAt: tastedSample.modifiedAt
                    });
                    yield newTasted.save();
                }
            }
        });
    }
    deleteTastedSamples(tastedSamples, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield tastedSample_1.TastedSample.deleteMany({
                sampleId: { $in: tastedSamples.map(val => { return val.sampleId; }) },
                userId: userId
            });
        });
    }
}
exports.UserRepository = UserRepository;
