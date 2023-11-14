"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Catalogue = void 0;
const mongoose_1 = require("mongoose");
const catalogueSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    description: String,
    year: { type: Number, required: true },
    startDate: { type: Number, required: true },
    address: { type: String, required: true },
    location: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true }
    },
    imageUrl: [{ type: String, required: false }],
    published: { type: Boolean, required: true, default: false },
    locked: { type: Boolean, required: true, default: false }
});
exports.Catalogue = (0, mongoose_1.model)("Catalogue", catalogueSchema);
