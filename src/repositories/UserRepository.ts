import Long from "long";
import { Catalogue } from "../models/catalogue";
import { CommissionMember } from "../models/CommissionMember";
import { FavoriteWine } from "../models/favoriteWine";
import { GrapeVarietal } from "../models/GrapeVarietal";
import { IRatedSample, RatedSample } from "../models/RatedSample";
import { ISample, Sample } from "../models/sample";
import { ITastedSample, TastedSample } from "../models/TastedSample";
import { IUser, User } from "../models/user";
import { Winary } from "../models/winary";
import { Wine } from "../models/wine";
import { ResponseError } from "../utils/ResponseError";

export class UserRepository {

    async getUsers() {
        return await User.find({});
    }

    async getUserByEmail(email: string) {
        const user = await User.findOne({ email });
        if (user == null) {
            throw new ResponseError("Incorrect credentials", 400);
        }
        return user;
    }

    async getUserById(id: string) {
        const user = await User.findById(id);
        if (user == null) {
            throw new ResponseError("User does not exist", 404);
        }
        return user;
    }

    async createUser(userData: IUser) {
        // check if user already exists
        const email = userData.email
        const res = await User.findOne({ email })
        if (res) {
            throw new ResponseError("User with this email address already exists");
        }

        const user = new User(userData);
        await user.save();
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