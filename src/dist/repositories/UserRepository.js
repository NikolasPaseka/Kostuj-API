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
const CommissionMember_1 = require("../models/CommissionMember");
const favoriteWine_1 = require("../models/favoriteWine");
const GrapeVarietal_1 = require("../models/GrapeVarietal");
const RatedSample_1 = require("../models/RatedSample");
const sample_1 = require("../models/sample");
const user_1 = require("../models/user");
const winary_1 = require("../models/winary");
const wine_1 = require("../models/wine");
const ResponseError_1 = require("../utils/ResponseError");
class UserRepository {
    constructor() {
        this.getCommissionCatalogues = (userId) => __awaiter(this, void 0, void 0, function* () {
            const commissionCatalogues = yield CommissionMember_1.CommissionMember.find({ userId }).select("catalogueId");
            const ids = [];
            commissionCatalogues.map((element) => { ids.push(element.catalogueId.toString()); });
            return yield catalogue_1.Catalogue.find({ published: false }).where("_id").in(ids).exec();
        });
        this.getRatedSamples = (userId, catalogueId) => __awaiter(this, void 0, void 0, function* () {
            return yield RatedSample_1.RatedSample
                .find({
                commissionMemberId: userId
            })
                .populate({
                path: "sampleId",
                model: sample_1.Sample,
                match: { catalogueId }
            })
                .exec();
        });
    }
    getUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield user_1.User.find({});
        });
    }
    getUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_1.User.findOne({ email });
            if (user == null) {
                throw new ResponseError_1.ResponseError("User with this email does not exist", 404);
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
    // TODO - change to tasted wine sample
    getFavoriteWine(wineId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield favoriteWine_1.FavoriteWine.findOne({ wineId, userId });
        });
    }
    changeFavoriteWineState(wineId, userId, favorite, id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (favorite) {
                const favoriteWine = new favoriteWine_1.FavoriteWine({ wineId: wineId, userId: userId });
                yield favoriteWine.save();
            }
            else if (id != null) {
                yield favoriteWine_1.FavoriteWine.findOneAndDelete({ _id: id });
            }
            else {
                throw new ResponseError_1.ResponseError("Something went wrong");
            }
        });
    }
    updateFavoriteWineNotes(wineId, userId, notes) {
        return __awaiter(this, void 0, void 0, function* () {
            yield favoriteWine_1.FavoriteWine.updateOne({ wineId, userId }, { $set: { notes: notes } });
        });
    }
    getFavoriteWines(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const favorites = yield favoriteWine_1.FavoriteWine.find({ userId }).select("wineId");
            const ids = [];
            favorites.map((element) => { ids.push(element.wineId.toString()); });
            return yield wine_1.Wine.find().where("_id").in(ids).populate([{
                    path: "winaryId",
                    model: winary_1.Winary
                }, {
                    path: "grapeVarietals",
                    model: GrapeVarietal_1.GrapeVarietal
                }]).exec();
        });
    }
}
exports.UserRepository = UserRepository;
