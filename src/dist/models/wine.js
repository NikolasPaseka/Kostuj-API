"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wine = void 0;
const mongoose_1 = require("mongoose");
const wineSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    color: { type: String, required: true },
    year: {
        type: Number,
        required: true,
        set: function (res) { return Math.round(res); }
    },
    type: { type: String, required: true },
    description: { type: String },
    grapeVarietals: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "GrapeVarietal" }],
    imageUrl: { type: String, required: false },
    winaryId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Winary" }
});
exports.Wine = (0, mongoose_1.model)("Wine", wineSchema);
