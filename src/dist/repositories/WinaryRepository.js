"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WinaryRepository = void 0;
const Winary_1 = require("../models/Winary");
const ResponseError_1 = require("../utils/ResponseError");
class WinaryRepository {
    async getWinaries() {
        return await Winary_1.Winary.find({});
    }
    async getWineryDetail(wineryId) {
        const winery = await Winary_1.Winary.findById(wineryId);
        if (winery == null) {
            throw new ResponseError_1.ResponseError("Catalogue not found", 404);
        }
        return winery;
    }
}
exports.WinaryRepository = WinaryRepository;
