import { Schema, model, InferSchemaType, Types } from "mongoose";
import bcrypt from "bcrypt";
import { saltRounds } from "../utils/constants";
import { UserAuthOption } from "./utils/UserAuthOption";

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
    refreshTokens: [{ type: String }],
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

export type IUser = InferSchemaType<typeof userSchema> & Partial<{ _id: Types.ObjectId }>; 

export const User = model("User", userSchema);
