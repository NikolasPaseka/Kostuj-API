"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Winary = void 0;
const mongoose_1 = require("mongoose");
const winarySchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    imageUrl: String
});
exports.Winary = (0, mongoose_1.model)("Winary", winarySchema);
