"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Winary = void 0;
const mongoose_1 = require("mongoose");
const winarySchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    description: { type: String },
    phoneNumber: { type: String },
    email: { type: String },
    websitesUrl: { type: String },
    address: { type: String, required: true },
    imageUrl: String,
    location: {
        latitude: { type: Number },
        longitude: { type: Number }
    },
});
exports.Winary = (0, mongoose_1.model)("Winary", winarySchema);
