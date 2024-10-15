import { Mongoose, ObjectId } from "mongoose";
import { Catalogue } from "../models/Catalogue";
import { CommissionMember } from "../models/CommissionMember";
import { RatedSample } from "../models/RatedSample";
import { Sample } from "../models/Sample";
import { ITastedSample, TastedSample } from "../models/TastedSample";
import { IUser, User } from "../models/User";
import { ResponseError } from "../utils/ResponseError";

export class UserRepository {

    async getAllUsers() {
        return await User.find().select("-password");
    }

    async getUserByEmail(email: string) {
        return await User.findOne({ email });
    }

    async getUserById(id: ObjectId | string) {
        const user = await User.findById(id).select("email firstName lastName avatarImageUrl");
        if (user == null) {
            throw new ResponseError("User does not exist", 404);
        }
        return user;
    }

    async createUser(userData: IUser) {
        // check if user already exists
        userData.createdAt = new Date();
        userData.updatedAt = new Date();
        const res = await this.getUserByEmail(userData.email);
        if (res) {
            throw new ResponseError("User with this email address already exists");
        }
        const user = new User(userData);
        return user.save();
    }

    async deleteUser(userId: string) {
        await User.deleteOne({ _id: userId });
        await TastedSample.deleteMany({ userId: userId });
        await CommissionMember.deleteMany({ userId: userId });
    }

    editUserData = async (userId: ObjectId, userData: IUser) => {
        await User.updateOne(
            { _id: userId },
            { $set: { 
                firstName: userData.firstName,
                lastName: userData.lastName
            }}
        )
    }

    editUserAvatar = async (userId: ObjectId, avatarImageUrl: string) => {
        await User.updateOne({ _id: userId }, { avatarImageUrl });  
    }

    addUserRefreshToken = async (userId: string, token: string) => {
        await User.updateOne(
            { _id: userId },
            { $push: { refreshTokens: token }}
        );
    }

    deleteUserRefreshToken = async (userId: string, token: string) => {
        await User.updateOne(
            { _id: userId },
            { $pull: { refreshTokens: token }}
        );
    }

    deleteAllUserRefreshTokens = async (userId: string) => {
        await User.updateOne(
            { _id: userId },
            { $set: { refreshTokens: [] }}
        )
    }

    getCommissionCatalogues = async (userId: string) => {
        const commissionCatalogues = await CommissionMember.find({ userId }).select("catalogueId");
        const ids: string[] = []
        commissionCatalogues.map((element) => { ids.push(element.catalogueId.toString()) });

        return await Catalogue.find({ published: false }).where("_id").in(ids).exec();
    }

    getRatedSamples = async (userId: string, catalogueId: string) => {
        const filteredResult = await RatedSample
            .find({
                commissionMemberId: userId
            })
            .populate({
                path: "sampleId",
                model: Sample,
                match: { catalogueId }
            })
            .exec();
    
        return await RatedSample.find({
            "_id": { $in: filteredResult.map(val => { return val.id })}
        }).exec();
    }

    addRatedSample = async (commissionMemberId: string, sampleId: string, rating: number, update: boolean) => {
        const existedRatedSample = await RatedSample.findOne({ commissionMemberId, sampleId });

        if (update && existedRatedSample == null) {
            throw new ResponseError("Sample has not been rated yet");
        } else if (!update && existedRatedSample != null) {
            throw new ResponseError("Sample already rated by this commission member");
        }

        if (update) {
            const updatedSample = await RatedSample.findOneAndUpdate({
                commissionMemberId, sampleId
            },{
                rating
            }, {new: true})
            return (updatedSample);
        }

        const ratedSample = new RatedSample({ commissionMemberId, sampleId, rating });
        await ratedSample.save();
        return ratedSample;
    }


    async getTastedSamples(catalogueId: string, userId: string) {
        const filteredResult = await TastedSample.find({
            userId
        }).populate({
            path: "sampleId",
            model: Sample,
            match: { catalogueId }
        }).exec()

        return await TastedSample.find({
            "_id": { $in: filteredResult.map(val => { return val.id })}
        }).exec();
    }

    
    async updateTastedSamples(tastedSamples: ITastedSample[], userId: string) {
        for (const tastedSample of tastedSamples) {
            const foundResult = await TastedSample.findOne({
                sampleId: tastedSample.sampleId,
                userId: userId
            }).exec();

            if (foundResult != null) {
                // update tasted wine
                await TastedSample.findOneAndUpdate({
                    sampleId: tastedSample.sampleId,
                    userId: userId,
                    modifiedAt: { $lt: tastedSample.modifiedAt }
                }, {
                    rating: tastedSample.rating,
                    note: tastedSample.note,
                    modifiedAt: tastedSample.modifiedAt
                }).exec()
            } else {
                // Add tasted wine to database
                const newTasted = new TastedSample({
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

    async deleteTastedSamples(tastedSamples: ITastedSample[], userId: string) {
        await TastedSample.deleteMany({
            sampleId: { $in: tastedSamples.map(val => { return val.sampleId }) },
            userId: userId
        })
    }
}