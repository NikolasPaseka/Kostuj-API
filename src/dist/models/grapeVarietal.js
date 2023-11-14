"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GrapeVarietal = void 0;
var mongoose_1 = require("mongoose");
var grapeVarietalSchema = new mongoose_1.Schema({
    grape: { type: String, required: true },
    shortcut: { type: String, required: true }
});
exports.GrapeVarietal = (0, mongoose_1.model)("GrapeVarietal", grapeVarietalSchema);
