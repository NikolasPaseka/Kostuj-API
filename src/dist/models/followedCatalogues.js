"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FollowedCatalogue = void 0;
const mongoose_1 = require("mongoose");
const followedCatalogueSchema = new mongoose_1.Schema({
    catalogueId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Catalogue" },
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" }
});
exports.FollowedCatalogue = (0, mongoose_1.model)("FollowedCatalogues", followedCatalogueSchema);
