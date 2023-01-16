"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sample = void 0;
const mongoose_1 = require("mongoose");
const sampleSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    rating: { type: Number, required: false },
    catalogueId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Catalogue" },
    wineId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Wine" }
});
exports.Sample = (0, mongoose_1.model)("Sample", sampleSchema);
