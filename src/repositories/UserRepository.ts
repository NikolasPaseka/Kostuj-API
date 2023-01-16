import { Catalogue } from "../models/catalogue";
import { FavoriteWine } from "../models/favoriteWine";
import { FavoriteWinery } from "../models/FavoriteWinery";
import { FollowedCatalogue } from "../models/followedCatalogues";
import { GrapeVarietal } from "../models/GrapeVarietal";
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
            throw new ResponseError("User with this email does not exist", 404);
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


    async getFavoriteWine(wineId: string, userId: string) {
        return await FavoriteWine.findOne({ wineId, userId });
    }

    async changeFavoriteWineState(wineId: string, userId: string, favorite: boolean, id?: string) {
        if (favorite) {
            const favoriteWine = new FavoriteWine({ wineId: wineId, userId: userId });
            await favoriteWine.save();
        } else if (id != null) {
            await FavoriteWine.findOneAndDelete({_id: id});
        } else {
            throw new ResponseError("Something went wrong");
        }
    }

    async updateFavoriteWineNotes(wineId: string, userId: string, notes: string) {
        await FavoriteWine.updateOne({ wineId, userId }, { $set: { notes: notes } });
    }

    async getFavoriteWines(userId: string) {
        const favorites = await FavoriteWine.find({ userId }).select("wineId");
        const ids: string[] = []
        favorites.map((element) => { ids.push(element.wineId.toString()) });

        return await Wine.find().where("_id").in(ids).populate([{
            path: "winaryId",
            model: Winary
        }, {
            path: "grapeVarietals",
            model: GrapeVarietal
        }]).exec();
    } 

    async getFollowedCatalogue(catalogueId: string, userId: string) {
        return await FollowedCatalogue.findOne({ catalogueId, userId });
    }

    async getFollowedCatalogues(userId: string) {
        const followed = await FollowedCatalogue.find({ userId }).select("catalogueId");
        const ids: string[] = [];
        followed.map((element) => { ids.push(element.catalogueId.toString()) });

        return await Catalogue.find().where("_id").in(ids).exec();
    }

    async followCatalogue(catalogueId: string, userId: string) {
        const followedCatalogue = new FollowedCatalogue({ catalogueId: catalogueId, userId: userId });
        await followedCatalogue.save();
    }

    async unfollowCatalogue(id: string) {
        await FollowedCatalogue.findOneAndDelete({_id: id});
    }

    async getFavoriteWinery(wineryId: string, userId: string) {
        return await FavoriteWinery.findOne({ wineryId, userId });
    }

    async changeFavoriteWineryState(wineryId: string, userId: string, favorite: boolean, id?: string) {
        if (favorite) {
            const favoriteWinery = new FavoriteWinery({ wineryId: wineryId, userId: userId });
            await favoriteWinery.save();
        } else if (id != null) {
            await FavoriteWinery.findOneAndDelete({_id: id});
        } else {
            throw new ResponseError("Something went wrong");
        }
    }

    async getFavoriteWineries(userId: string) {
        const favorites = await FavoriteWinery.find({ userId }).select("wineryId");
        const ids: string[] = [];
        favorites.map((element) => { ids.push(element.wineryId.toString()) });

        return await Winary.find().where("_id").in(ids).exec();
    }

    async getUpcomingCatalogueEvent(userId: string) {
        const followed = await FollowedCatalogue.find().sort({ startDate: "desc" }).exec();
        const ids: string[] = []
        followed.map((element) => { ids.push(element.catalogueId.toString()) });

        const upcoming = await Catalogue.find().where("_id").in(ids).sort({ startDate: "asc" });
        if (upcoming.length > 0) {
            return upcoming[0];
        } 
        return null;
    }
}