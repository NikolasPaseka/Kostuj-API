"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FavoriteWinery = void 0;
const mongoose_1 = require("mongoose");
const favoriteWinery = new mongoose_1.Schema({
    wineryId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Winary" },
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" }
});
exports.FavoriteWinery = (0, mongoose_1.model)("FavoriteWinery", favoriteWinery);
