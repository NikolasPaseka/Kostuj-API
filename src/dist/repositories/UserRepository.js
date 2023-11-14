"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const Catalogue_1 = require("../models/Catalogue");
const CommissionMember_1 = require("../models/CommissionMember");
const RatedSample_1 = require("../models/RatedSample");
const Sample_1 = require("../models/Sample");
const TastedSample_1 = require("../models/TastedSample");
const User_1 = require("../models/User");
const ResponseError_1 = require("../utils/ResponseError");
class UserRepository {
    constructor() {
        this.getCommissionCatalogues = async (userId) => {
            const commissionCatalogues = await CommissionMember_1.CommissionMember.find({ userId }).select("catalogueId");
            const ids = [];
            commissionCatalogues.map((element) => { ids.push(element.catalogueId.toString()); });
            return await Catalogue_1.Catalogue.find({ published: false }).where("_id").in(ids).exec();
        };
        this.getRatedSamples = async (userId, catalogueId) => {
            const filteredResult = await RatedSample_1.RatedSample
                .find({
                commissionMemberId: userId
            })
                .populate({
                path: "sampleId",
                model: Sample_1.Sample,
                match: { catalogueId }
            })
                .exec();
            return await RatedSample_1.RatedSample.find({
                "_id": { $in: filteredResult.map(val => { return val.id; }) }
            }).exec();
        };
        this.addRatedSample = async (commissionMemberId, sampleId, rating, update) => {
            const existedRatedSample = await RatedSample_1.RatedSample.findOne({ commissionMemberId, sampleId });
            if (update && existedRatedSample == null) {
                throw new ResponseError_1.ResponseError("Sample has not been rated yet");
            }
            else if (!update && existedRatedSample != null) {
                throw new ResponseError_1.ResponseError("Sample already rated by this commission member");
            }
            if (update) {
                const updatedSample = await RatedSample_1.RatedSample.findOneAndUpdate({
                    commissionMemberId, sampleId
                }, {
                    rating
                }, { new: true });
                return (updatedSample);
            }
            const ratedSample = new RatedSample_1.RatedSample({ commissionMemberId, sampleId, rating });
            await ratedSample.save();
            return ratedSample;
        };
    }
    async getUserByEmail(email) {
        const user = await User_1.User.findOne({ email });
        if (user == null) {
            throw new ResponseError_1.ResponseError("Incorrect credentials", 400);
        }
        return user;
    }
    async getUserById(id) {
        const user = await User_1.User.findById(id);
        if (user == null) {
            throw new ResponseError_1.ResponseError("User does not exist", 404);
        }
        return user;
    }
    async createUser(userData) {
        // check if user already exists
        const email = userData.email;
        const res = await User_1.User.findOne({ email });
        if (res) {
            throw new ResponseError_1.ResponseError("User with this email address already exists");
        }
        const user = new User_1.User(userData);
        await user.save();
    }
    async getTastedSamples(catalogueId, userId) {
        const filteredResult = await TastedSample_1.TastedSample.find({
            userId
        }).populate({
            path: "sampleId",
            model: Sample_1.Sample,
            match: { catalogueId }
        }).exec();
        return await TastedSample_1.TastedSample.find({
            "_id": { $in: filteredResult.map(val => { return val.id; }) }
        }).exec();
    }
    async updateTastedSamples(tastedSamples, userId) {
        for (const tastedSample of tastedSamples) {
            const foundResult = await TastedSample_1.TastedSample.findOne({
                sampleId: tastedSample.sampleId,
                userId: userId
            }).exec();
            if (foundResult != null) {
                // update tasted wine
                await TastedSample_1.TastedSample.findOneAndUpdate({
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
                const newTasted = new TastedSample_1.TastedSample({
                    sampleId: tastedSample.sampleId,
                    userId: userId,
                    rating: tastedSample.rating,
                    note: tastedSample.note,
                    modifiedAt: tastedSample.modifiedAt
                });
                await newTasted.save();
            }
        }
    }
    async deleteTastedSamples(tastedSamples, userId) {
        await TastedSample_1.TastedSample.deleteMany({
            sampleId: { $in: tastedSamples.map(val => { return val.sampleId; }) },
            userId: userId
        });
    }
}
exports.UserRepository = UserRepository;
