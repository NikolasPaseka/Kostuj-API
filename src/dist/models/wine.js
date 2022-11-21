"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wine = void 0;
const mongoose_1 = require("mongoose");
const wineSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    color: { type: String, required: true },
    winaryId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Winary" }
});
exports.Wine = (0, mongoose_1.model)("Wine", wineSchema);
