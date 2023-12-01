import { Schema, model, InferSchemaType } from "mongoose";
import bcrypt from "bcrypt";
import { saltRounds } from "../utils/constants";

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
    lastName: { type: String, required: true },
    avatarImageUrl: { type: String, required: false }
});

userSchema.pre("save", async function (next) {
    const user = this;
    if (user.isModified("password")) {
        user.password = await bcrypt.hash(user.password, saltRounds);
    }
    next()
});

export type IUser = InferSchemaType<typeof userSchema>;

export const User = model("User", userSchema);