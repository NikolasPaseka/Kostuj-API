import { Schema, model, InferSchemaType, Document, Types } from "mongoose";
import bcrypt from "bcrypt";
import { saltRounds } from "../utils/constants";
import { UserAuthOption } from "./utils/UserAuthOption";

// export interface IUser {
//     email: string,
//     password: string,
//     firstName: string,
//     lastName: string,
//     avatarImageUrl: string
// }

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String },
    avatarImageUrl: { type: String, required: false },
    refreshTokens: [{ type: String}],
    accountOption: {
        type: String,
        required: true,
        default: UserAuthOption.Basic,
        enum: UserAuthOption
    }
});

userSchema.pre("save", async function (next) {
    const user = this;
    if (user.isModified("password") && user.password != null) {
        user.password = await bcrypt.hash(user.password, saltRounds);
    }
    next()
});

export type IUser = InferSchemaType<typeof userSchema>; 

export const User = model("User", userSchema);
