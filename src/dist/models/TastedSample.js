"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TastedSample = void 0;
const mongoose_1 = require("mongoose");
const tastedSampleSchema = new mongoose_1.Schema({
    sampleId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Sample" },
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    note: { type: String },
    rating: { type: Number, required: true },
    modifiedAt: { type: Number, default: new Date().getTime() }
});
exports.TastedSample = (0, mongoose_1.model)("TastedSample", tastedSampleSchema);
