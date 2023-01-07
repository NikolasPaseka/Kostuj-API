import { FavoriteWine } from "../models/favoriteWine";
import { FollowedCatalogue } from "../models/followedCatalogues";
import { IUser, User } from "../models/user";
import { Wine } from "../models/wine";
import { ResponseError } from "../utils/ResponseError";

export class UserRepository {

    async getUsers() {
        return await User.find({});
    }

    async getUserByEmail(email: string) {
        const user = await User.findOne({ email });
        if (user == null) {
            throw new ResponseError("Incorrect credentials", 404);
        }
        return user;
    }

    async createUser(email: string, password: string) {
        // check if user already exists
        const res = await User.findOne({ email })
        if (res) {
            throw new ResponseError("User with this email address already exists");
        }

        const user = new User({ email, password });
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

    async getFollowedCatalogue(catalogueId: string, userId: string) {
        return await FollowedCatalogue.findOne({ catalogueId, userId });
    }

    async followCatalogue(catalogueId: string, userId: string) {
        const followedCatalogue = new FollowedCatalogue({ catalogueId: catalogueId, userId: userId });
        await followedCatalogue.save();
    }

    async unfollowCatalogue(id: string) {
        await FollowedCatalogue.findOneAndDelete({_id: id});
    }
}