import { IUser, User } from "../models/user";
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
}