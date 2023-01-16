"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FavoriteWine = void 0;
const mongoose_1 = require("mongoose");
const favoriteWineSchema = new mongoose_1.Schema({
    wineId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Wine" },
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    notes: { type: String }
});
exports.FavoriteWine = (0, mongoose_1.model)("FavoriteWine", favoriteWineSchema);
