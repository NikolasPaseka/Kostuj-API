"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GrapeVarietal = void 0;
const mongoose_1 = require("mongoose");
const grapeVarietalSchema = new mongoose_1.Schema({
    grape: { type: String, required: true },
    shortcut: { type: String, required: true },
    color: { type: String },
});
exports.GrapeVarietal = (0, mongoose_1.model)("GrapeVarietal", grapeVarietalSchema);
