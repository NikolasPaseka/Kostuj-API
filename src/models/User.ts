import { Schema, model, InferSchemaType, Types } from "mongoose";
import bcrypt from "bcrypt";
import { saltRounds } from "../utils/constants";
import { UserAuthOption } from "./utils/UserAuthOption";
import { create } from "domain";
import { AuthorizationRoles } from "./utils/AuthorizationRoles";

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
    },
    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date, default: Date.now() },
    authorizations: [{ 
        type: Number, 
        default: [AuthorizationRoles.USER], 
        enum: AuthorizationRoles
    }]
});

userSchema.set('toObject', { virtuals: true });

userSchema.pre("save", async function (next) {
    const user = this;
    if (user.isModified("password") && user.password != null) {
        user.password = await bcrypt.hash(user.password, saltRounds);
    }
    next()
});

userSchema.pre("updateOne", async function (next) {
    const user = this.getUpdate() as { password?: string };
    if (user.password) {
        user.password = await bcrypt.hash(user.password, saltRounds);
    }
    next()
});


export type IUser = InferSchemaType<typeof userSchema> & Partial<{ _id: Types.ObjectId }>; 

export const User = model("User", userSchema);
