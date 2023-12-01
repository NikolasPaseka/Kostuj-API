"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
const constants_1 = require("../utils/constants");
// export interface IUser {
//     email: string,
//     password: string,
//     firstName: string,
//     lastName: string,
//     avatarImageUrl: string
// }
const userSchema = new mongoose_1.Schema({
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
        user.password = await bcrypt_1.default.hash(user.password, constants_1.saltRounds);
    }
    next();
});
exports.User = (0, mongoose_1.model)("User", userSchema);
